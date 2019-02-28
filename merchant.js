var maxUpgrade=7
var maxCompoundLevel=3
var maxGrade=0

setInterval(function(){
	merchant()

},1000*1); // Loops every 1 seconds.


function merchant()
{
	upgradeItems();
	compoundItems();
	exchangeItems();
	buffPlayers()
}

function locateItem(name)
{
	for(var i=0;i<42;i++)
	{
		if(character.items[i] && character.items[i].name==name) return i;
	}
	return -1;
}

function upgradeItems()
{
	for(var i=0;i<character.items.length;i++)
	{
		if(character.items[i] != null)
		{
			item = character.items[i]
			var itemDef=G.items[character.items[i].name];
			if(itemDef.upgrade && item.level<maxUpgrade && item_grade(item)<=maxGrade)
			{
				upgradeItem(i);
			}
		}
	}
}

function buffPlayers()
{
	for(id in parent.entities)
	{
		var current=parent.entities[id];
		if(current.type=="character")
		{
			playerTargeted=get_player(current.name)
			if(G.skills.mluck.mp<character.mp && parent.game_stringify(playerTargeted.s.mluck,2) == "undefined")
			{
				game_log("Casting mluck on " + playerTargeted.name)
				use("mluck",current)
			}
		}
	}
}

function exchangeItems()
{
	for(var i=0;i<character.items.length;i++)
	{
		if(character.items[i] != null)
		{
			item = character.items[i]
			var itemDef=G.items[character.items[i].name];
			if(itemDef.e!=null && item.q>=itemDef.e)
			{
				game_log("Exchanging " + item.name);
				smart_move("exchange");
				exchange(i);
			}
		}
	}
}

function locateSimilarItem(item)
{
	var similarItems=[];
	for(var i=0;i<character.items.length;i++)
	{
		if(character.items[i] != null && character.items[i].name==item.name && character.items[i].level==item.level )
		{
			similarItems.push(i);
		}
	}
	return similarItems;
}

function compoundItems()
{
	for(var i=0;i<character.items.length;i++)
	{
		if(character.items[i] != null)
		{
			item = character.items[i]
			var itemDef=G.items[character.items[i].name];
			if(itemDef.compound && item.level<maxCompoundLevel && item_grade(item)<=maxGrade)
			{
				similarItems=locateSimilarItem(item);
				if(similarItems.length>2)
				{
					compoundItem(i,similarItems[0],similarItems[1]);
				}
			}
		}
	}
}

function upgradeItem(i)
{
	//item_grade(item)==2 rare; 1 high, 0 normal
	//currently only upgrade grade 0
	var item=character.items[i];
	if(item_grade(item)==0) 
	{
		itemPlace=locateItem("scroll0");
	}
	else if(item_grade(item)==1) 
	{
		itemPlace=locateItem("scroll1");
	}
	else if(item_grade(item)==2) 
	{
		itemPlace=locateItem("scroll2");
	}
	if(itemPlace>=0)
	{
		var offering=null;
		game_log("Upgrading " + item.name);
		smart_move("upgrade");
		upgrade(i,itemPlace,offering);
	}
}

function compoundItem(i,j,k)
{
	var item=character.items[i];
	if(item_grade(item)==0) 
	{
		itemPlace=locateItem("cscroll0");
	}
	else if(item_grade(item)==1) 
	{
		itemPlace=locateItem("cscroll1");
	}
	else if(item_grade(item)==2) 
	{
		itemPlace=locateItem("cscroll2");
	}
	if(itemPlace>=0)
	{
		var offering=null;
		game_log("Compouning " + item.name);
		smart_move("compound");
		compound(i,j,k,itemPlace,offering);
	}
}
	
function logJSON(e)
{
	game_log(parent.game_stringify(e,2));
}