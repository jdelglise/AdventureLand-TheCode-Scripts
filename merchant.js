var maxUpgrade=7
var maxCompoundLevel=3
var maxGrade=0

setInterval(function(){
	merchant()

},1000*15); // Loops every 15 seconds.


function merchant()
{
	upgradeItems();
	compoundItems();
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

function locateSimilarItem(item)
{
	var similarItems=[];
	for(var i=0;i<character.items.length;i++)
	{
		if(character.items[i].name==item.name && character.items[i].level==item.level )
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
				similarItems=locateSimilarItem();
				if(similarItems.length>2)
				{
					upgradeItem(i,similarItems[0],similarItems[1]);
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
	elseif(item_grade(item)==1) 
	{
		itemPlace=locateItem("scroll1");
	}
	elseif(item_grade(item)==2) 
	{
		itemPlace=locateItem("scroll2");
	}
	if(itemPlace>=0)
	{
		var offering=null;
		game_log("Upgrading " + item.name);
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
	elseif(item_grade(item)==1) 
	{
		itemPlace=locateItem("cscroll1");
	}
	elseif(item_grade(item)==2) 
	{
		itemPlace=locateItem("cscroll2");
	}
	if(itemPlace>=0)
	{
		var offering=null;
		game_log("Compouning " + item.name);
		compound(i,j,k,itemPlace,offering);
	}
}
	
function logJSON(e)
{
	game_log(parent.game_stringify(e,2));
}