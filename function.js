//Source code of: use_hp_or_mp_custo
previousHP=""
lastDamages=""
function use_hp_or_mp_custo()
{
	if(safeties && mssince(last_potion)<600) return;
	var used=false;
	minHPTrigger=50
	minHPPercentToKeep=50
	minMPTrigger=50
	minMPPercentToKeep=50
	//Code below does the following : log the last damage received
	//If this amount is above the min amout set above, will be taken into account
	//else will use it to trigger the hp pot
	if(previousHP!="" && previousHP!=character.hp) lastDamages=previousHP-character.hp
	previousHP=character.hp
	if(lastDamages!="" && lastDamages*1.5 > minHPTrigger) HPTrigger=lastDamages*1.5
	else HPTrigger=minHPTrigger
	HPTrigger=HPTrigger+(minHPPercentToKeep/100*character.max_hp)
	if(character.hp<HPTrigger) use('use_hp'),used=true;
	MPTrigger=minMPTrigger+(minMPPercentToKeep/100*character.max_mp)
	if(character.mp<MPTrigger) use('use_mp'),used=true;
	if(used) last_potion=new Date();
}
//Create the party
function inviteMyOtherChar()
{
	send_party_invite("Nedina",0)
	send_party_invite("Sparadra",0)
	send_party_invite("Nedina",0)
	send_party_invite("GoldmanSachs",0)
	send_party_invite("AllyMayCry",0)
}
// Below code is used to handle party behavior, based on one leader
// Currently, leader is the tank
var partyLeaderName="Nedjed"
function protectMates()
{
	for(id in parent.entities)
	{
		var current=parent.entities[id];
		if(current.type=="monster" && current.target != null && current.target != partyLeaderName)
		{
			playerTargeted=get_player(current.target)
			if (playerTargeted != null && playerTargeted.party==character.party)
			{
				oldTarget=character.target;
				newTarget=current;
				if(can_use("taunt"))
				{
					use("taunt",newTarget)
				}
				character.target=oldTarget
			}
		}
	}
}
function attackLeaderTarget()
{
	leader=get_player(partyLeaderName);
	var target=get_target_of(leader);
	if(target)
	{
		if(!in_attack_range(target))
		{
			move(
				character.x+(target.x-character.x)/2,
				character.y+(target.y-character.y)/2
				);
			// Walk half the distance
		}
		else if(can_attack(target))
		{
			set_message("Attacking");
			attack(target);
		}
	}
}
function followLeader()
{
	// Walk half the distance to the leader, keep a distancee of followBy
	// in the direction, mitigated on the ratio X/Y
	followBy=80 //radius
	leader=get_player(partyLeaderName);
	distX=leader.real_x-character.real_x
	distY=leader.real_y-character.real_y
	//Mitigation done below for followBy param
	ratioX=distX/(distY+distX)
	ratioY=distY/(distY+distY)
	followByX=followBy*ratioX
	followByY=followBy*ratioY
	//Define direction : up, down, right, left
	newX=character.real_x+(distX)/2+followByX;
	newY=character.real_y+(distY)/2+followByY;
	//move
	move(newX,newY);
}
function healLeader()
{
	leader=get_player(partyLeaderName);
	heal_custo(leader);
}
//End party related
var occurence=1
function circleMove()
{
	//The idea is simple, perform circle around the initial position
	//By changing nbSteps, you can configure it to change direction faster
	nbSteps=10
	if(occurence <= nbSteps/4) move(character.x+50,character.y); 
	else if(occurence <= nbSteps/4*2) move(character.x,character.y+50); 
	else if(occurence <= nbSteps/4*3) move(character.x-50,character.y); 
	else if(occurence <= nbSteps) move(character.x,character.y-50);
	else occurence=1
	occurence=occurence+1
}
var pullDone=false
function getTargetCusto()
{
	minXP=character.level*30;
	maxAtt=character.hp/3;
	return get_nearest_monster({min_xp:minXP,max_att:maxAtt,
						no_target:true,path_check:true});
	
}
function kiteEnnemy()
{
	var target=get_targeted_monster();
	if(!target)
	{
		pullDone=false
		target=getTargetCusto();
		if(target) change_target(target);
		else
		{
			set_message("No Monsters");
			return;
		}
	}
	if(!in_attack_range(target) && !pullDone)
	{
		// move used instead of xmove to keep it simple and avoid weird behaviours
		move(
			character.x+(target.x-character.x)/2,
			character.y+(target.y-character.y)/2
			);
		// Walk half the distance
	}
	else if(pullDone)
	{
		set_message("Running");
		circleMove();
	}
	else if(can_attack(target) && !pullDone)
	{
		set_message("Attacking");
		pullDone=true
		attack(target);
	}
}
function fight()
{
	var target=get_targeted_monster();
	if(!target)
	{
		target=getTargetCusto();
		if(target) change_target(target);
		else
		{
			set_message("No Monsters");
			return;
		}
	}
	if(!in_attack_range(target))
	{
		xmove(
			character.x+(target.x-character.x)/2,
			character.y+(target.y-character.y)/2
			);
		// Walk half the distance
	}
	else if(can_attack(target))
	{
		set_message("Attacking");
		attack(target);
	}
}
function buy_potions()
{
	var x=character.real_x,y=character.real_y,map=character.map;
	smart_move({to:"potions"},function(done){
		buy("hpot0",500);
		buy("mpot0",50);
		game_log("Got the potions!","#4CE0CC");
		smart_move({x:x,y:y,map:map}); //Return back to the original position
		//If you block your main code when is_moving(character), you can buy potions this way and return back without a hassle
	});
}
function heal_custo(player)
{
	if(can_heal(player) && (player.hp/player.max_hp)<0.8) heal(player), set_message("Heal Player " +player);
}
function heal_party()
{
	for(id in parent.entities)
	{
		var current=parent.entities[id];
		if(current.type=="character" || !current.rip) continue;
		if(current.party && character.party==current.party) continue;
		heal_custo(current);
	}
}