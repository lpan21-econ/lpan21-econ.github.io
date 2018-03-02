if (window.location.search.match( /print-pdf/gi )) {
    var head = document.getElementsByTagName( 'head' )[0];

    var link = document.createElement( 'link' );
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '/reveal.js/css/print/pdf.css';
    head.appendChild( link );

    /*
    var link = document.createElement( 'link' );
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '/reveal.js/css/theme/white.css';
    head.appendChild( link );
    */
}
