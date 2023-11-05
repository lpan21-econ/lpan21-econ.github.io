#! Making a Webcam Speedometer

*by [Doug Hanley](/), published 2021-01-09*

Being a new parent in the time of COVID this past year meant I spent a good amount of time looking out the window, in this case a rather large window that affords a nice view of the street without. It also meant I had a newfound alertness for potential safety hazards, and I started wondering if the cars passing by weren't going a little too fast. Here in Pittsburgh, we live on a one-way street that originates from a 35 mph thoroughfare, only a few houses down, and the speed limit on our street is 25 mph.

!img [width=65|url=speedcam/window_scene_small.jpg]

I always remembered seeing the highway patrol using their "radar guns" to enforce speed limits (or raise revenue), which I'm assuming operate on some sort of Doppler effect. They would position themselves at the most acute possible angle, presumably to measure an apparent speed as close as possible to the target vehicle's actual speed, and perhaps to obscure their presence from the driver until it is too late to slow down.

Anyway, I wanted to do this in a more perpendicular manner, and I didn't have a speed gun, but I did have a webcam and a fancy GPU (though you can actually get by with a decent CPU). No doubt, people working on self-driving cars are light years ahead of me on these kinds of tasks, but I wanted to see how well I could do on my own.

You can find all the underlying code for this project on GitHub at [iamlemec/speedcam](https://github.com/iamlemec/speedcam). I try to describe the algorithm in full below, but there are invariably some details I leave out, like how to flatten images coming from a fisheye lens in real time.

#* Algorithm

There are roughly two steps to the algorithm: (1) convert frames from the camera into labelled coordinate boxes ("car" at [0.2, 0.2, 0.4, 0.3]); (2) track these matches coherently over time using a [Kalman filter](https://en.wikipedia.org/wiki/Kalman_filter). There are a number of parameters that we can fiddle with for each of these steps.

I do the first step by using the stock [YOLOv5](https://github.com/ultralytics/yolov5) from Ultralytics, specifically the largest `yolov5x` variant (though even the smallest `yolov5s` can still do the job). It's possible to fine tune these models using one's own hand classified, but I don't really have time for this and it works pretty well as is. This algorithm returns a list of matches, with each constituting a label ("car"), a coordinate box (normalized to $[0,1]^2$), and confidence level on the match (in $[0,1]$). So the main parameter we have to work with here is a threshold for the confidence level `qual_cutoff` for what constitutes a true match. Because funky stuff tends to happen at the edges of the frame, I also include `edge_cutoff` that rejects matches that are too near to the frame edge.

!img [width=75|url=speedcam/car_snapshot.png]

Once we have a match, this information is reduced down to a real vector and assessed using a Kalman filter. This vector includes 7 elements in total: the coordinates of the box center, the height and width of the box, and the average RGB color values of the box. The Kalman filter is initialized with a hard-coded, diagonal covariance matrix. In addition, the measurement errors are hard-coded and diagonal as well. Thus for an existing Kalman track, we get a predicted distribution of positions at any given time. ^[Just to be clear on terminology, a "match" an object in a single frame, and a "track" is a series of matches that we have deemed correspond to the same object.]

Each match is then judged to either be a new data point on an existing track or an entirely new track itself. But how do we make that call? Given a set of $n$ existing tracks with predicted mean and covariance vectors $(\mu_i, \Omega_i$) and a set of $m$ new matches $x_j$, for any pair we can compute the Mahalanobis distance

$$* d_{ij} = \sqrt{ (x_j-\mu_i) \Omega_i^{-1} (x_j-\mu_i) }

Under a normality assumption, this $d_{ij}$ follows a $\chi^2$ distribution with degrees of freedom equal to the length of the vector (in this case 7). Thus we can calculate a normalized metric using the CDF of the $\chi^2$ distribution $F_{\chi^2}$

$$* \hat{d}_{ij} = F_{\chi^2}(d_{ij}|7) \in [0,1]

On top of this, I also an explicit time decay, so that we don't get tracks randomly getting picked up much later. For a time decay rate $\alpha$ (`time_decay`) and time since last match $\Delta$, this renormalized metric is defined by

$$* \log \tilde{d}_{ij} = \exp(-\alpha \Delta) \cdot \log \hat{d}_{ij}

Finally, we impose a cutoff `match_cutoff`, meaning we discard any pairs with distance higher than this cutoff. Then we are left with a list of $(i,j,\tilde{d}_{ij})$ triplets. It's possible that a given $i$ has multiple potential $j$ matches. So we sort this list in increasing order by $\tilde{d}_{ij}$ and assign matches in that order, discarding any $(i,j)$ pairs for which $i$ already has a match. At the end, we are also left with some unmatched $j$'s, and these are our brand new tracks. For the matched tracks, we update $(\mu_i,\Omega_i)$ with $x_j$ using Kalman filter logic. A track is deemed over when it doesn't get an update for more than `match_timeout` seconds (I use 1.5 here). Here's an example track

!img [width=75|url=speedcam/car_track.gif]

#* Speedometer

The motivating factor here was to track car speeds, so let's get to that. The eventual output of the track detection process is, for each track, a time series of the 7 variables tracked by the Kalman filter, in addition to the timestamp for each frame, which we store when it is received. But these are in normalized coordinate space (i.e., 0 to 1). We need to map these into the physical space that we observe. To do this, we need to get a sense of the size of the scene we're observing, and in particular, the full width of the perpendicular road surface that cars travel on. I went out and did that, and it turns out its about 13.48 meters here. We can then infer the height from the aspect ratio of the video stream. ^[Well, this isn't exactly right, since you can see I'm observing the scene from a slight downward angle, but it should be close enough, and vertical speeds shouldn't be that large!]

So first we scale the output of the Kalman filter up by these `width` and `height` physical size factors. The Kalman filter yields estimates for the rate of change of each variable at every measurement point. So one way to calculate speed would be to simply look at the average of the rate of change of the center point. Another method, which should yield similar results, is to forget the Kalman filter outputs for speed determination purposes and simply use the (physically scaled up) box data that we fed into it. Suppose this constitutes a series of $T$ points $(x_t,y_t)$. Then we can run two independent OLS regression of the form

$$*&
x_t & \sim p_x + v_x t \\
y_t & \sim p_y + v_y t

This yields point estimates and standard errors for $(p_x,v_x)$ and $(p_y,v_y)$, and our velocity estimates will be precisely $v_x$ and $v_y$. From this we can compute an overall speed estimate (which we expect will be dominated by $v_x$) of

$$* v = \sqrt{v_x^2+v_y^2} \qquad \qquad \sigma_v = \sqrt{\pfr{v_x}{v}^2\sigma_{v_x}^2+\pfr{v_y}{v}^2\sigma_{v_y}^2}

Hooray! We have a speed estimate. For the video track above, the resulting estimate is 19.0 ± 0.4 mph, so not a speeder.

#* Statistics

Now that we can track the speed of passing cars, we can run the tracking setup for a while and see some overall statistics. First, we'd naturally be interested in the distribution of speeds. How fast are people going? How many people are speeding? We might also be interested how this varies by time of day. And just the raw counts of cars throughout the day would be good to know.

I ran the tracker for one morning to see how things might vary over time, with particular attention on rush hour. Looking at the data, the average speed is almost exactly 15 mph for each hour. Here are the speed distributions by hour (the bands are kernel densities)

!img [width=75|url=speedcam/hourly_speed.svg]

So only one speeder! I guess that's good? In terms of raw counts, at least for this one day, we're actually seeing more traffic in the 11AM hour than any of the earlier rush hour times. Not sure what to make of it, but here's the data

!img [width=75|url=speedcam/hourly_counts.svg]

Well, that's all for now! I suppose I should be happy that people generally aren't going too fast. Still, the ever increasing size of American vehicles, combined with often aggressive driving on the part of motorists nonetheless makes me worry. Certainly, I can investigate the former with this setup. The latter would be harder, but maybe doable?
