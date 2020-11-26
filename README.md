Note:la version en français de ce document est disponible [ici](XXXXXXX) !


# Maïa, the application


Welcome!
This repository contains all the code we put together to build the application that allows you to control a Maïa mood lamp! Maïa is a lamp that can be assembled with very few (and cheap) components, 3D printed parts, and controlled remotely from your phone or computer using bluetooth!

If you already have a lamp, get the app [here](XXXXXXX) now! 
If you wish to build your own lamp, check out the other sections of [this repository] (XXXX).


Structure of the app
------------------------

React and Redux
PWA
Integration with web bluetooth for the interaction with the lamp
Connector to handle the Bluetooth communication
Redux store used for the modes configuration and the rules (shared across components)

Dependencies
- iro color picker
- react-tabs 


Features
------------------------

Available only on Chrome for Android and desktop (not available for iOS yet, web bluetooth not supported)
4 applications
Description of what each of them does
Home -> for now only connect, later on possibility to add the OTA button


Further work and contact
----------------------------

Here are some of the improvements that we are thinking about:

- support other languages on the application (currently only available in French)
- add support for OTA
- add options for rules
	- possibility to enable automatic turn on based on a noise (some ML to implement)
	- handle user inputs with warnings when the values are not good
	- hours as well as minutes for the time before turning off the automatisms if no noise heard
- implement an iOS application (web bluetooth supported only on Chrome for desktop and Android)

Also, don't hesitate to get in touch with us, if you liked this project, if you would like to suggest improvements or contribute!
We are [Alexina Coullandreau](https://www.acoullandreau.com) and [Gustavo Buzogany Eboli](https://www.gbuzogany.com)
