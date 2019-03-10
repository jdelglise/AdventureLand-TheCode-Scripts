var leaderName="Nedjed"
var merchantName="GoldmanSachs";
var minLifeForHeal=0.8
//Source code of: use_hp_or_mp_custo
lastDamages=""
previousHP=""	
minHPTrigger=50
minHPPercentToKeep=50
minMPTrigger=50
minMPPercentToKeep=80
function use_hp_or_mp_custo()
{
	if(safeties && mssince(last_potion)<600) return;
	var used=false;
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
function protectMates()
{
	for(id in parent.entities)
	{
		var current=parent.entities[id];
		if(current.type=="monster" && current.target != null && current.target != leaderName)
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
manaBurstName="burst"
minMpForBurst=0.6
manaBurstLastUse=new Date();
specialAttackUsed=false
function specialAttack(target)
{
	actionPerfomed=0
	if(character.ctype=="mage")	
	{
		if(character.mp/character.max_mp > minMpForBurst && character.mp >= G.skills[manaBurstName].mp && can_use(manaBurstName))
		{
			if(mssince(manaBurstLastUse) > G.skills[manaBurstName].cooldown)
			{
				use(manaBurstName,target);
				manaBurstLastUse=new Date();
				actionPerfomed++;
			}
		}
	}
	if (actionPerfomed > 0) specialAttackUsed=true
	else specialAttackUsed=false
}
function attackLeaderTarget()
{
	leader=get_player(leaderName);
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
			specialAttack(target);
			if(!specialAttackUsed) attack(target);
		}
	}
}
function followLeader()
{
	followBy=80 //radius
	leader=get_player(leaderName);
	distX=leader.x-character.x
	distY=leader.y-character.y
	var leadTarget=get_target_of(leader);
	if(leadTarget && leadTarget.type=="monster") 
	{
		distTargX=leader.x-leadTarget.x
		distTargY=leader.y-leadTarget.y
		ratioTargetX=distTargX/(Math.abs(distTargY)+Math.abs(distTargX))
		ratioTargetY=distTargY/(Math.abs(distTargY)+Math.abs(distTargX))
		newX=character.x+distX/2+(followBy*ratioTargetX);
		newY=character.y+distY/2+(followBy*ratioTargetY);	
	}
	else //stricly follow leader if no target
	{
		newX=character.x+(distX/2);
		newY=character.y+(distY/2);
	}
	move(newX,newY);
}
function healLeader()
{
	leader=get_player(leaderName);
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
minHpForShell=0.55
shieldSpellName="hardshell"
var shellLastUse=new Date();
function tank()
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
	else if(character.hp/character.max_hp < minHpForShell && character.mp >= G.skills[shieldSpellName].mp && can_use(shieldSpellName))
	{
		if(mssince(shellLastUse) > G.skills[shieldSpellName].cooldown)
		{
			use(shieldSpellName);
			shellLastUse=new Date();
		}
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
	if(can_heal(player) && (player.hp/player.max_hp)<minLifeForHeal) heal(player), set_message("Heal " +player);
}
partyHealName="partyheal"
partyHeallLastUse=new Date();
function heal_party()
{
	nbToHeal=0
	leadNeedHeal=false
	for(id in parent.entities)
	{
		// checks who need to be healed, with a small twist for the leader which is already healed by default on character script
		var current=parent.entities[id];
		if(current != null && current.type=="character" && !current.rip)
		{
			if(character.party==current.party && (current.hp/current.max_hp)<minLifeForHeal)
			{
				if(current.name != leaderName)
				{
					toHeal=current;
					nbToHeal=nbToHeal+1;
				}
				else
				{
					leadNeedHeal=true;
				}
			}
		}
		// now checking the current character since it was not in the loop above
		if((character.hp/character.max_hp)<minLifeForHeal)
		{
			toHeal=character;
			nbToHeal=nbToHeal+1;
		}
	}
	// Now we know how many char needs to be healed, with a separate count for the leader
	if(nbToHeal==1 && !leadNeedHeal)
	{
		heal_custo(toHeal);
	}
	else if(nbToHeal>1 || (nbToHeal==1 && leadNeedHeal))
	{
		if(character.mp >= G.skills[partyHealName].mp && can_use(partyHealName))
		{
			if(mssince(partyHeallLastUse) > G.skills[partyHealName].cooldown)
			{
				use(partyHealName,toHeal);
				set_message("Party heal !!!");
				partyHeallLastUse=new Date();
			}
		}
	}
}
function sendItemToMerchant()
{
	for(var i=0;i<character.items.length;i++)
	{
		if(character.items[i] != null)
		{
			item = character.items[i]
			var itemDef=G.items[character.items[i].name];
			if(itemDef.type != "pot")
			{
				if(item.q != null)
				{
				  send_item(merchantName,i,item.q);
				}
				else
				{
					send_item(merchantName,i,1);
				}
			}
		}
	}
}