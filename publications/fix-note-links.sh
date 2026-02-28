#!/bin/bash
sed -i.bak \
  -e 's|&lt;br/&gt;&lt;a href="\([^"]*\)"&gt;\([^&]*\)&lt;/a&gt;|<div class="oa-button-wrap"><a class="oa-button" href="\1">\2</a></div>|g' \
  _site/publications/index.html
rm -f _site/publications/index.html.bak