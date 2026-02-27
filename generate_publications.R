#!/usr/bin/env Rscript
# generate_publications.R
#
# Reads publications/references.bib and writes publications/index.qmd
# with entries grouped by year under ## headings.
# Run this script after updating references.bib, then `quarto render`.

library(RefManageR)

BibOptions(
  check.entries = FALSE,
  style         = "html",
  bib.style     = "authoryear",
  sorting       = "ydnt"
)

# Strip only single-line fields that cause problems:
#   urldate -> triggers RefManageR date validator error via no.print.fields
#   month   -> produces "2024NA" in authoryear output
#   file    -> local file paths (unwanted in output)
#   keywords -> unwanted in output
# Multi-line fields (abstract, copyright, etc.) are left alone;
# authoryear style does not include them in output anyway.
drop_fields  <- c("file", "urldate", "month", "keywords", "issn")
drop_pattern <- paste0("^\\s*(", paste(drop_fields, collapse = "|"), ")\\s*=")

raw <- readLines("publications/references.bib")
raw <- raw[!grepl(drop_pattern, raw, ignore.case = TRUE)]
tmp <- tempfile(fileext = ".bib")
writeLines(raw, tmp)

bib <- ReadBib(tmp, check = FALSE)

# Extract year for each entry (missing/empty -> "n.d.")
get_year <- function(i) {
  yr <- bib[[i]]$year
  if (is.null(yr) || nchar(trimws(yr)) == 0) "n.d." else trimws(yr)
}

all_years     <- sapply(seq_along(bib), get_year)
numeric_years <- sort(unique(as.integer(all_years[all_years != "n.d."])),
                      decreasing = TRUE)
year_order    <- c(as.character(numeric_years),
                   if (any(all_years == "n.d.")) "n.d.")

# --- Build the output lines ---
lines <- c(
  '---',
  'title: "Publications"',
  'toc: true',
  '---',
  ''
)

for (yr in year_order) {
  idx    <- which(all_years == yr)
  yr_bib <- bib[idx]
  label  <- if (yr == "n.d.") "No date" else yr

  NoCite(yr_bib, "*")
  html_out <- capture.output(PrintBibliography(yr_bib))

  lines <- c(
    lines,
    paste0("## ", label),
    "",
    "::: {=html}",
    html_out,
    ":::",
    "",
    "---",
    ""
  )
}

out_path <- "publications/index.qmd"
writeLines(lines, out_path)
cat("Written:", out_path, "\n")
