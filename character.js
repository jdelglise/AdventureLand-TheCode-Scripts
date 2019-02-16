// Hey there!
// This is CODE, lets you control your character with code.
// If you don't know how to code, don't worry, It's easy.
// Just set attack_mode to true and ENGAGE!

var kite=false
load_code('Functions')
leaderName="Nedjed"

setInterval(function(){

	use_hp_or_mp_custo();
	loot();
	if(character.rip || is_moving(character)) return;
	var leader=get_player(leaderName);
	if(leader)
	{
		leaderXP=leader.xp;
		myXP=character.xp
		if(myXP==leaderXP) //if I am the leader
		{
			if(character.party == null)
			{
				inviteMyOtherChar();
			}
			else
			{
				protectMates();
			}
			if(kite) kiteEnnemy();
			else fight();
		}
		else
		{
			if(character.party == null)
			{
				accept_party_invite(leaderName);
			}
			followLeader();
			if (character.ctype=="priest")
			{
				var healDone=false
				healLeader();
				heal_party();
				if(!healDone) attackLeaderTarget();
			}
			else
			{
				attackLeaderTarget();
			}
		}
	}
	else
	{
		game_log("Break");
	}
	//if(quantity("hpot0") < 50) buy_potions;
},1000/8); // Loops every 1/4 seconds.



// Learn Javascript: https://www.codecademy.com/learn/learn-javascript
// Write your own CODE: https://github.com/kaansoral/adventureland