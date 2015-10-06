James McConnell
100943832
October 6 2015

The server is accessable from localhost:3001/myapp.html
Run the server with node "Assignment1_serverside.js"

KNOWN ISSUES

If you call more than one song without restarting the server it appends the song you called the second time to the array storing the first song, and displays the whole thing again

The grab-range for the words isn't accurate

the chords and words dont display exactly where they should, its very close but because of the amount of hardcoding i did to understand what the fuck was going on it doesnt work 100% correctly

the functionality described in R1.4 and R3.3 was not even attempted to be implemented(the button is commented out, although i did make the html object), i had too much trouble with the rest of the assignment to get close to adding this

ive had a weird issue every once and a while where when i restart the sever it says the port is taken, im not 100% sure why but changing the port it listens too works as a fix.

Requirements fufilled 
R1.1
R1.2
R1.3
R1.5

R2.1
R2.2

R3.1
R3.2 (they are draggable, the grab-range is messed up)
R3.4 (again this is implemented, its just not 100% accurate)
R3.5 (this kind of works, you can request a file but it gets appended to the end of the previous song)