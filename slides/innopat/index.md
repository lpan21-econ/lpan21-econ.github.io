# Discussion
### "Misappropriation of R&D Subsidies: Estimating Treatment Effects with One-sided Noncompliance" by Philipp Boeing and Bettina Peters

<br/>

### Douglas Hanley (University of Pittsburgh)

<br/>

##### Innopat 2022 (Mannheim)

---

## Subsidy Misappropriation

This is a great paper! Makes my job difficult, in some sense

I particularly liked the funding graphs, which are intimidating at first, but upon careful study make the notion of a "pecking order" crystal clear

\\[
\underbrace{\text{Entropy Balancing}}\_{\text{pseudo-randomization}} \longrightarrow \underbrace{\text{R\\&D Subsidy}}\_{\text{intent-to-treat}} \longrightarrow \underbrace{\text{Misappropriation}}_{\text{NON-compliance}}
\\]

Very useful results as an "end user": how much can we rely in research subsidies to achieve our goals? Question of how much we can generalize/specialize this

---

## Hidden Misappropriation

Thinking about firm size and the measurement of misappropriation: large firms hould be able to "hide" misappropriation in existing R&D spending

<script type="text/gum">
let make_text = s => Text(s, {font_family: 'IBMPlexSans', font_weight: 100});
let dashes = 4;

let frame1 = (() => {
  let subs = 2;
  let shad = VBar(subs, {fill: 'lightgray', fill_opacity: 0.4, stroke_dasharray: dashes});
  let bar1 = VBars([[1, 0], [2, shad]], {shrink: 0.3});
  let bar2 = VBars([[1, 1], [2, 1.3]], {shrink: 0.3});
  let labels = Scatter([
    [make_text('subsidy'), [2, 2.1, 0.2]]
  ]);
  let plot = Plot([bar1, bar2, labels], {
    xlim: [0.3, 2.7], ylim: [0, 3.2], xticks: [[1, 't'], [2, 't+1']], title: 'Small Firm',
    yticks: [], ylabel: 'R&D Spending / Subsidy', labeloffset: 0.05, titleoffset: 0, aspect: phi
  });
  let frame = Frame(plot, {margin: [0.05, 0, 0.05, 0]});
  return frame;
})();

let frame2 = (() => {
  let subs = 2;
  let shad = VBar(subs, {zero: 0, fill: 'lightgray', fill_opacity: 0.4, stroke_dasharray: dashes});
  let bar1 = VBars([[1, 0], [2, shad]], {shrink: 0.3});
  let bar2 = VBars([[1, 2.5], [2, 2.9]], {shrink: 0.3});
  let labels = Scatter([
    [make_text('subsidy'), [2, 2.1, 0.2]]
  ]);
  let plot = Plot([bar1, bar2, labels], {
    xlim: [0.3, 2.7], ylim: [0, 3.2], xticks: [[1, 't'], [2, 't+1']], title: 'Large Firm',
    yticks: [], labeloffset: 0.05, aspect: phi, titleoffset: 0
  });
  let frame = Frame(plot, {margin: [0.05, 0, 0.05, 0]});
  return frame;
})();

let stack = HStack([frame1, frame2], {expand: false});
let frame = Frame(stack, {margin: 0.1});
return SVG(frame, {size: 800});
</script>

But is this really misappropriation? Is it different from crowding out? <!-- .element style="margin-top: -20px;" -->

---

## Mismeasurement of Subsidies

Somewhat worried about the switch in data sources happening around 2006/2007 and the fact that we see big changes starting around then (around MLP policy change), especially since we're looking for "missing" R&D
\\[
\log \mathbb{E}[p] = \beta_0 + \beta_1 \log(R_0) + \beta_2 \log(R_1) + \eps
\\]

But presumably true production function is additive, such as in
\\[
\log \mathbb{E}[p] = \alpha_0 + \alpha_1 \log(R_0+R_1) + \eps
\\]

Lead to underestimate of effect size in proportion to share of subsidies in R&D
\\[
\beta_2 = \pder{\log\mathbb{E}[p]}{\log(R_1)} = \alpha_1 \pfr{R_1}{R_0+R_1} < \alpha_1
\\]

---

## Backup Figure

![hidden misappropriation](innopat/images/misapprop.svg) <!-- .element style="width: 100%;" -->
