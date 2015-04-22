if (window.location.search.match( /print-pdf/gi )) {
    var head = document.getElementsByTagName( 'head' )[0];

    var link = document.createElement( 'link' );
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'pdf.css';

    head.appendChild( link );

    window.onload = function() { window.print(); }
}
