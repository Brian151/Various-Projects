The goal here is to reverse-engineer the "open" adobe XFL format that
represents the internal structure of all .fla files CS5 and up, or
can be saved as an uncompressed folder structure called the "XFL Document".
This is to allow anything and EVERYTHING to be recovered from a .fla
document so as to allow easier migration of source code and assets to
non-adobe platforms. There are no plans to re-produce the complicated BEAST
that is the Adobe Flas/Animate IDE, but since this takes the form of an
open source library, I cannot guarantee that someone else will or will not
do it. That said, I hardly see this as posing a threat to Flash/Animate.
Honestly, I don't think anything could EVER truly compete with it.
At this time, reversing the previous version of .fla is not planned

Current features:
loading/decompressing a FLA via JSZip and logging the header and library structure
broken/ugly parsing of shape edges

