#!/bin/bash
# Fix escaped HTML in bibliography note fields
# Converts &lt;br/&gt;&lt;a href="..."&gt;...&lt;/a&gt; into proper clickable links
sed -i '' \
  -e 's|&lt;br/&gt;&lt;a href="\([^"]*\)"&gt;\([^&]*\)&lt;/a&gt;|<div class="oa-button-wrap"><a class="oa-button" href="\1">\2</a></div>|g' \
  _site/publications/index.html
