# AdventureLand-TheCode-Scripts
JavaScript created for the game "Adventure Land - The Code", feel free to use
------------------------------------------
------------------------------------------
How To Use
------------------------------------------
------------------------------------------

------------------------------------------
function.js
------------------------------------------

Save the function.js as functions the game

/!\ A few variable should be changed to match your account :

- partyLeaderName="Nedjed" // put your leader name here, preferably a war

- function inviteMyOtherChar() // change all my character names by yours

Other functions might also be fine tuned as you whish with the params, e.g : 

  minHPPercentToKeep=50 // reduce it to save potions, increase it to increase survavibility
  minLifeForHeal=0.8 // Priest param only, in my situations 80% is perfect, for your case you might change it ;)
  
------------------------------------------
character.js
------------------------------------------

Load character script to any of your character


------------------------------------------
------------------------------------------
What this script can do
------------------------------------------
------------------------------------------
This script does the following :

- use potions when needed (based on params)
- attack ennemies in area, but won't attack too weak target for your level

- Have a party behaviour :
  - The leader (tank) :       - invite all your characters to a group
                              - choose the ennemies and tank them
                              - taunt ennemis targeting your allies
   - The others (dps, heal) : - accept leader invites
                              - attack the leader target
                              - follow the leader and stay at a certain range
                              - heal the tank in prio + heal the whole party (healer only, cast skill party heal) 
                              
------------------------------------------
------------------------------------------
Futur improvement
------------------------------------------
------------------------------------------

------------------------------------------
Merchant and item crafting
------------------------------------------
- Add a specific code to send all items to merchant
- Merchant will decide what to do with items and will upgrade it, exchange it or sell it

------------------------------------------
Automated journey
------------------------------------------
- Currently the leader needs to be moved manually to a zone, this should be automated at some point (will requires a lot of effort)

------------------------------------------
Behaviour enhancement
------------------------------------------
- Currently, the character are not able to "unstuck" themselves, manual move might be required
- During fight, the tank should start kitting when low life
- Add more spell casting (currently only 2 are used)
- Create more solo behaviour, currently always party
- Create "superiors" behaviour to take advantage over other groups present in the zone


and many others
