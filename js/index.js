addEventListener("DOMContentLoaded", _ => {
    const expand = document.querySelectorAll('.expand');
    expand.forEach(elem => {
        elem.addEventListener('click', event => {
            const text = window.getSelection().toString();
            const tag = event.target.tagName.toLowerCase();
            if ((text.length == 0) && (tag != 'a')) {
                expand.forEach(elem1 => {
                    if (elem1 != elem) {
                        elem1.classList.remove('expanded');
                    }
                });
                elem.classList.toggle('expanded');
            }
        });
    });
});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-9065807-1', 'auto');
ga('send', 'pageview');
