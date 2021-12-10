# CSCI 3428 Software Engineering:  Mi'kmaq Wheel Of Fortune
This program is a game based on the T.V. show Wheel Of Fortune  which was deisgned to help promote the Mi'kmaq language to youth. The active webpage can viewed <a href=http://ugdev.cs.smu.ca/~group11/>here</a> . It's also important to note that this app is designed for an http server and the multiplayer won't work if host on a https in it's current state.  

## Installation
The program requires the following dependencies.
<ol>
<li><a href="https://www.npmjs.com/package/express">Express</a></li>
<li><a href="https://www.npmjs.com/package/express-ws">Express-ws</a></li>
<li><a href="https://www.npmjs.com/package/events">Events</a></li>
<li><a href="https://www.npmjs.com/package/mysql2">mysql2</a></li>
</ol>
Note that these don't have to be install directly It will be discussed how to download these later in this section, however the install will make use of the npm package manger.
<br></br>
The software can be setup as follows.
<ol>
<li>
Download the source code with the following command in the terminal.

```
git clone https://github.com/brandon2278/Wheel_Of_Fortune.git public_html
```
Note that public_html can be renamed to whatever you want to call the directory.

</li>

<li>
Next you have to cd into the server folder which can be done as follows.

```
cd public_html/server/
```

Here you can download all the required dependencies with the following command.

```
npm install
```

</li>

<li>
Finally, you can start the server with the follwoing command in the server folder.

```
npm start
```

This will run the server as a background process. 
</li>
</ol>

Now the project can be ran and used on a html server.

## Features

### Singleplayer
The app features a single player mode with 6 puzzle categories you can choose from, which are as follows.
<ul>
<li>Animals</li>
<li>Greetings</li>
<li>Phrases</li>
<li>Food</li>
<li>Earth</li>
<li>Numbers</li>
</ul>
The mode serves as an endless mode where the goal is to get as many points as you can.

### Multiplayer
The app features a multiplayer mode where you can play with other users. Below is a description of each component of the multiplayer.
#### Lobbies
The mode supports the creaction of custum lobbies where you can select drifferent game settings. Lobbys can be open for anyone to join or password protected. Each user has a color assigned to them that they can choose by clicking their icon in the lobby.  Lobbies have a chatting system so users can communicate with each other. This chat is filtered for profane words before it's displayed to the users. The leader of the lobby can kicked players by clicking on their icon.

#### Matchmaking
If you don't want to create a lobby you can join a queue to search for players to play with. Lobbies created via matchmaking are hidden to other users so only the users that were matched together can play together.

#### Game
The game is turn based where there are a set number of rounds with a set number of puzzles. These values are set upon creation of the room. Each turn the player has three options. 
<ol>
<li>Spin the wheel and guess a letter</li>
<li>Buy a vowel</li>
<li>Guess the word</li>
</ol>
Once the game ends their stats are updated to be displayed on the leaderboard.

### Leaderboards
The leaderboards are where you can see the stats for everyone who used the app. You can sort the leaderbaord by drifferent stats by clicking on their respective title. The user can also search for a specific player in the leaderbaord.

### User Accounts
To use the app the user will have to create an account. An account has a name, username and a 4 digit passcode field that the user will have to fill out. Once a user creates an account they can sign in to the app. 

### Modifiable Database
The puzzles in the database can be edited within the app by a user with admin privileges. The admin can add or remove puzzle from the database. The admin can also see a list of the current puzzles in the database.
