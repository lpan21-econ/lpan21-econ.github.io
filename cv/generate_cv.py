#!/usr/bin/env python3

import re
import os
import sys
import toml
import jinja2

if len(sys.argv) == 1:
    do_html = True
    do_latex = True
else:
    task = sys.argv[1]
    if task == 'html':
        do_html = True
        do_latex = False
    elif task == 'latex':
        do_html = False
        do_latex = True
    else:
        print('Invalid task')
        sys.exit(0)

info_fname = 'cv_info.toml'

html_in_name = 'html_template.html'
html_out_name = 'hanley_cv.html'

latex_in_name = 'latex_template.tex'
latex_out_name = 'hanley_cv.tex'

info_html = toml.load(open(info_fname))

def html_to_latex(e):
    t = type(e)
    if t is dict:
        return {html_to_latex(k):html_to_latex(v) for (k,v) in e.items()}
    elif t is list:
        return [html_to_latex(e1) for e1 in e]
    elif t is str:
        s = e
        s = s.replace('#','\\#')
        s = s.replace('&','\\&')
        s = s.replace('<br/>',' \\\\\n')
        s = re.sub(r'<a href=\"([^>]*)\">([^<]*)</a>',r'\\href{\1}{\2}',s)
        s = re.sub(r'<b>([^<]*)</b>',r'\\textbf{\1}',s)
        s = re.sub(r'<i>([^<]*)</i>',r'\\textit{\1}',s)
        return s
    else:
        return e

info_latex = html_to_latex(info_html)

# html
if do_html:
    template = jinja2.Template(open(html_in_name).read())
    html = template.render(**info_html)
    file_html = open(html_out_name,'w+')
    file_html.write(html)

# latex
if do_latex:
    template = jinja2.Template(open(latex_in_name).read())
    latex = template.render(**info_latex)
    file_latex = open(latex_out_name,'w+')
    file_latex.write(latex)
