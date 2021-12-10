# CSCI 3428:  Mi'kmaq Wheel Of Fortune
This program is a game based on the T.V. show Wheel Of Fortune  which was deisgned to help promote the Mi'kmaq languageto youth as apart of service-learning class at Saint Mary's University. The active webpage can viewed <a href=http://ugdev.cs.smu.ca/~group11/>here</a> .  

## Installation
To install and run the program, you will require the following dependencies. Note that these don't have to be install directly It will be discussed how to downlaod these laster in this section.
<ol>
<li><a href="https://www.npmjs.com/package/express">Express</a></li>
<li><a href="https://www.npmjs.com/package/express-ws">Express-ws</a></li>
<li><a href="https://www.npmjs.com/package/events">Events</a></li>
<li><a href="https://www.npmjs.com/package/mysql2">mysql2</a></li>
</ol>

The software can be setup as follows.
<ol>
<li>
Download the source code with the following command in the terminal.
<center>
```
git clone https://github.com/brandon2278/Wheel_Of_Fortune.git public_html
```
Note that public_html can be rename to whatever you want to call the directory.
</center>
</li>

<li>
Next you have to cd into the server folder which can be done as follows.
<center>
```
cd public_html/server/
```
</center>
Here you can download all the required dependencies with the following command.
<center>
```
npm install
```
</center>
</li>

<li>
Finally, you can start the server with the follwoing command in the server folder.
<center>
```
npm start
```
</center>
This will run the server as a background process. 
</li>
</ol>

Now the project can be ran and used on a server.

## Features

### Singleplayer
The app features a single player mode with 6 word categories you can choose from which are as follows.
<ul>
<li>Animals</li>
<li>Greetings</li>
<li>Phrases</li>
<li>Food</li>
<li>Earth</li>
<li>Numbers</li>
</ul>
The mode serves as an endless mode where you get as many point as you can.
### Multiplayer
The app features a multiplayer mode where you can play with other users. Below is a description of each component of the multiplayer.
#### Lobbies
The mode supports the creaction of custum lobbies where you can select drifferent game settings. Lobbys can be open for anyone to join or password protected. Each user has a color assigned to them that they can choose by clicking their icon in the lobby.  Lobbies have a chatting system so suer can communicate with each other. This chat is filtered for profane words before it's displayed to the users. The leader of the lobby can kicked players by clicking on their icon.
#### Matchmaking
If you don't want to create a lobby you can join a queue to search for players to play with. Lobbies create via matchmaking are hidden to other users so only the user that were matched together will be playing together.
#### Game
The game is turn based where there are a set number of rounds with a set number of puzzles. These values are set upon creation of the room. Each turn the player has three options. 
<ol>
<li>Spin the wheel and guess a letter</li>
<li>Buy a vowel</li>
<li>Guess the word</li>
</ol>
Once the game end their stats are updated to be displayed on the leaderboard.
### Leaderboards
The leaderboards are when you can see the stats for all the other players. You can sort the leaderbaord by drifferent stats by clicking on their respective title. The user can also search for a specific player in the leaderbaord.
### Modifiable Database
The puzzles in the database can be edited in the program by a user with admin privileges. The admin can add or remove puzzle from the database. The admin can also see a list of the current puzzles in the database.
