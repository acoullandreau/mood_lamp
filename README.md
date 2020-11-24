Note:la version en français de ce document est disponible [ici](XXXXXXX) !


# Maïa, the application


XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX



























Welcome!
This repository contains all the code we put together to build the Maïa mood lamp! Maïa is a lamp that can be assembled with very few (and cheap) components, 3D printed parts, and controlled remotely from your phone or computer using bluetooth! Not only will you be able to enjoy numerous light effects, set up some rules to automate when to turn it ON and OFF, but also get to know the temperature, air humidity and pressure of the room it is in!

If you already have a lamp, get the app [here](XXXXXXX) now! 


Context of the project
------------------------

Long story short, we love this king of stuff :)
We wanted to make a special gift for our family, and settled on a useful object that could combine so many things we are interested it: IoT, lighting, interfaces, and automation. That's how Maïa was born.

This lamp is simply composed of:

- a microcontroller (that supports Bluetooth Low Energy)
- 29 RGBW LEDs positioned as to form a sphere of light
- a sensor for air temperature, humidity and pressure
- a microphone
- a light sensor
- a RTC
- a micro USB connecter and a switch

Basically, the project can be broken down into three main areas, for each of which a section in this repository is available:

- the electronics and embedded code --> XXXXXXX
- the user interface --> webapp
- the assembly --> XXXXXXX


Features
---------


Here is a list of the key features of this lamp, through its app:

**Light modes**

- a color wheel allows a user to choose a color or color gradient
- any setting can be saved to be launched directly later on
- a set of preconfigured modes are embedded in the lamp

**Preconfigured modes** 

- react dynamically with the noise detected around by the microphone
- the color depends on the temperature of the room
- the color depends on the humidity of the room
- various effects for different moods or situations: daylight, sunset, reading,....

**Readings**

- The values are refreshed automatically twice per second
- The readings available are currently
	- temperature
	- humidity
	- air pressure
	- battery level of the RTC

**Automation rules**

- Let the lamp execute the best suited mode depending on the time of the day
- Deactivate the rules if no noise has been heard for a configured period of time (this can be useful to set if you leave for holidays for example!)
- Automatic turn ON and OFF
	- either based on the light level (if too bright or too dark)
	- or at a fixed time
	- possibility to start gradually dim the light ON and OFF a little before (at a configured time)




More details about the code
----------------------------

You can find details about the implementation on the microcontroller [here](XXXXXXX).
You can find details about the implementation of the application [here](XXXXXXX). 


Further work and contact
----------------------------

Here are some of the improvements that we are thinking about:

- support other languages on the application
- add support for OTA
- add options for rules
	- possibility to enable automatic turn on based on a noise (some ML to implement)
	- handle user inputs with warnings when the values are not good
	- hours as well as minutes for the time before turning off the automatisms if no noise heard
- implement an iOS application (web bluetooth supported only on Chrome for desktop and Android)

Also, don't hesitate to get in touch with us, if you liked this project, if you would like to suggest improvements or contribute!
We are [Alexina Coullandreau](https://www.acoullandreau.com) and [Gustavo Buzogany Eboli](https://www.gbuzogany.com)
