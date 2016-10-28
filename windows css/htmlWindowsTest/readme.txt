Disappointed with the available error generators, I made this.
Still extremely incomplete, and code is messy/buggy.
The goal is to emaulate various popup messages from the Windows OS
Unlike the AtomSmasher generator, these are interactive, and
will have many of the possible user interface styles available in their respective
versions of Windows.
It may incude some custom stuff, also.
SUPPORT WARNING:
Being that it relies heavily on CSS3 (specifically: border-image), 
it won't work right in especially older browsers. Nonetheless, there are
some fallback measures with solid colors instead of image 
(eg, they look pretty bad)

It goes without saying this whole project is in a very legally gray area, so
please don't do anything that would warrant response from Microsoft

Future plans include emulatating other UI styles, or easily providing the tools to do so.

notewrothy features:
"error popups"
All variations of original Luna (Windows XP) skin, in the default size
Classic and Classic:Standard (95-2000) 
[
one of them is actually wrong, IDK why...i screwd-up saving it somehow
]
Aero (Vista,7) Skin 
[
sorta...not sure if CSS can perfectly imitate that one, 
and if it can, I'll be re-iventing the wheel of how I created these
for just that one skin.
]
installer script 
[
WIP, assuming the site you're posting on allows JS and HTML,
this *should* automatically load the required files to correctly render the
simulated popups
]