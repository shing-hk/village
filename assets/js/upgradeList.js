// upgradeList.js
// Holds the upgrade schema, as well as definitions of all of the game's upgrades
// Includes the upgrades' effects as callbacks

"use strict";

class Upgrade {
	constructor(params = {}) {
		this.name = params?.name; // Primary text, shown as header
		this.description = params?.description; // Secondary text, shown as paragraph
		this.type = params?.type; // "craft" or "research"
		this.cost = params?.cost; // An object with at least one of the keys "wood", "food", "stone"
		this.duration = params?.duration; // Time it takes for the upgrade to complete (in seconds)
		this.once = params?.once; // True if upgrade should disappear once bought
		this.scaling = params.scaling; // Optional if once=true. If once=false, cost is multiplied by this amount every completion
		this.requirement = params?.requirement; // Optional, array of Game.levels fields and their minimum values for the upgrade to show up
		this.effect = params?.effect; // Function to run on buy
	}
}

Game.prototype.upgradeList = [
	// Major system progression upgrades
	new Upgrade({
		name: "搭建帳篷",
		description: "可容納兩名村民",
		type: "craft",
		cost: {
			wood: 10,
			food: 10,
		},
		duration: 2,
		once: true,
		effect: function (game) {
			game.levels.tent += 1;
			game.lumberjack += 2;
			game.unlock("assign");
			game.unlock("income");
			game.logMessage(
				"event",
				"有兩名村民加入了你的定居點"
			);
		},
	}),
	new Upgrade({
		name: "展開帳篷",
		description: "加一張床，以便容納額外的村民",
		type: "craft",
		cost: {
			wood: 20,
			food: 40,
		},
		duration: 2,
		once: false,
		scaling: 1.5,
		requirement: ["tent", 1],
		effect: function (game) {
			game.levels.tent += 1;
			game.lumberjack += 1;
			game.logMessage(
				"event",
				"One extra villager has joined your settlement."
			);
		},
	}),
	new Upgrade({
		name: "建造碼頭",
		description: "為村民建造一個釣魚碼頭",
		type: "craft",
		cost: {
			wood: 100,
		},
		duration: 4,
		once: true,
		requirement: ["tent", 1],
		effect: function (game) {
			game.levels.pier += 1;
			game.unlock("fisherman");
			game.logMessage(
				"event",
				"你建好了碼頭，現在可以調派漁民了"
			);
		},
	}),
	new Upgrade({
		name: "擴建碼頭",
		description: "較長的碼頭便於捕撈較大的魚",
		type: "craft",
		cost: {
			wood: 200,
		},
		duration: 4,
		once: false,
		scaling: 4,
		requirement: ["pier", 1],
		effect: function (game) {
			game.production.fisherman *= 2;
			game.levels.pier += 1;
			game.logMessage(
				"event",
				"你的漁民現在可以捕到更大的魚了"
			);
		},
	}),
	new Upgrade({
		name: "建造礦場",
		description: "開挖山體開採石頭",
		type: "craft",
		cost: {
			wood: 200,
		},
		duration: 5,
		once: true,
		requirement: ["pier", 1],
		effect: function (game) {
			game.unlock("stone");
			game.unlock("miner");
			game.logMessage(
				"event",
				"你已經建造了一個採石場，現在可以調派礦工了"
			);
			game.levels.quarry += 1;
		},
	}),
	new Upgrade({
		name: "開發礦場",
		description: "再挖一條隧道，通往新的石礦脈",
		type: "craft",
		cost: {
			wood: 250,
			stone: 100,
		},
		duration: 5,
		once: false,
		scaling: 4,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.levels.quarry += 1;
			game.production.miner *= 2;
			game.logMessage("event", "你的礦場現在入到更深的地方了");
		},
	}),
	new Upgrade({
		name: "建造工坊",
		description: "調派鐵匠協助你更快完成製作",
		type: "craft",
		cost: {
			wood: 200,
			stone: 200,
		},
		duration: 6,
		once: true,
		requirement: ["quarry", 2],
		effect: function (game) {
			game.levels.smithy += 1;
			game.unlock("blacksmith");
			game.unlock("craftSpeed");
			game.logMessage("event", "你蓋了個工坊！真棒！");
		},
	}),
	new Upgrade({
		name: "現代化改造工坊",
		description: "添置一些新工具，讓你的工匠更開心",
		type: "craft",
		cost: {
			wood: 400,
			stone: 400,
		},
		duration: 6,
		once: false,
		scaling: 2,
		requirement: ["smithy", 1],
		effect: function (game) {
			game.levels.smithy += 1;
			game.production.blacksmith *= 0.75;
			game.logMessage(
				"event",
				"你的工匠現在會幫上更大的忙"
			);
		},
	}),
	new Upgrade({
		name: "建造學院",
		description:
			"劃出一些村莊空間用於各種研究",
		type: "craft",
		cost: {
			wood: 1000,
			stone: 1000,
		},
		duration: 10,
		once: true,
		requirement: ["smithy", 3],
		effect: function (game) {
			game.levels.academy += 1;
			game.unlock("professor");
			game.unlock("research");
			game.unlock("researchSpeed");
			game.logMessage(
				"event",
				"你的學院現在已經開課了。你將學習什麼？"
			);
		},
	}),
	new Upgrade({
		name: "發展學院",
		description: "拓展你在新領域的知識",
		type: "craft",
		cost: {
			wood: 1500,
			stone: 2000,
		},
		duration: 10,
		once: false,
		scaling: 2,
		requirement: ["academy", 1],
		effect: function (game) {
			game.levels.academy += 1;
			game.production.professor *= 0.75;
			game.logMessage(
				"event",
				"你拓展了對世界的認知"
			);
		},
	}),
	new Upgrade({
		name: "導師計劃",
		description: "如果讓一個人監督另一個人呢？",
		type: "research",
		cost: {
			food: 1500,
		},
		duration: 6,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.mentorUnlocked = true;
			game.unlock("mentor");
			game.logMessage(
				"event",
				"事實證明，由導師指導新手是個非常好的主意！"
			);
		},
	}),
	new Upgrade({
		name: "人員管理",
		description: "不要自己工作，而是確保別人在工作",
		type: "research",
		cost: {
			food: 6000,
		},
		duration: 12,
		once: true,
		requirement: ["academy", 3],
		effect: function (game) {
			game.managerUnlocked = true;
			game.unlock("manager");
			game.logMessage(
				"event",
				"現在可以調派混亂控制者了！也稱為經理"
			);
		},
	}),

	// Job upgrades
	new Upgrade({
		name: "工藝木斧",
		description:
			"你的伐木工人會很高興他們再也不用赤手空拳了",
		type: "craft",
		cost: {
			wood: 40,
		},
		duration: 3,
		once: true,
		requirement: ["tent", 1],
		effect: function (game) {
			game.production.lumberjack *= 1.75;
			game.logMessage(
				"event",
				"你們的伐木工現在都配備了木斧"
			);
		},
	}),
	new Upgrade({
		name: "製作木製釣竿",
		description:
			"在水中揮舞手臂可能效果並不好",
		type: "craft",
		cost: {
			wood: 100,
		},
		duration: 3,
		once: true,
		requirement: ["pier", 1],
		effect: function (game) {
			game.production.fisherman *= 1.75;
			game.logMessage(
				"event",
				"你的漁民現在可以坐下來觀察魚餌了，真方便"
			);
		},
	}),
	new Upgrade({
		name: "製作木製鎬",
		description:
			"這並非世上最好的主意，但某程度上它確實能完成任務",
		type: "craft",
		cost: {
			wood: 120,
		},
		duration: 3,
		once: true,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.production.miner *= 1.75;
			game.logMessage(
				"event",
				"有了鎬子，你的礦工就不必再四處搜尋散落在各處的石頭了"
			);
		},
	}),
	new Upgrade({
		name: "工藝石斧",
		description: "用比樹木更堅硬的東西砍倒它們",
		type: "craft",
		cost: {
			wood: 20,
			stone: 50,
		},
		duration: 4,
		once: true,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.production.lumberjack *= 1.75;
			game.logMessage(
				"event",
				"石斧派上用場了。瞧瞧那些倒下的樹木！"
			);
		},
	}),
	new Upgrade({
		name: "製作石鎬",
		description: "瀟灑地破石",
		type: "craft",
		cost: {
			wood: 50,
			stone: 100,
		},
		duration: 5,
		once: true,
		requirement: ["quarry", 2],
		effect: function (game) {
			game.production.miner *= 1.75;
			game.logMessage(
				"event",
				"你的礦工正大膽地進入石器時代"
			);
		},
	}),
	new Upgrade({
		name: "磨利鎬頭",
		description: "用更尖銳的工具可以更快地敲碎岩石",
		type: "craft",
		cost: {
			wood: 60,
			stone: 120,
		},
		duration: 8,
		once: true,
		requirement: ["smithy", 1],
		effect: function (game) {
			game.production.miner *= 1.25;
			game.logMessage(
				"event",
				"經過短暫的適應期，你的礦工就弄清楚了應該把鎬的哪一端插入岩石中"
			);
		},
	}),
	new Upgrade({
		name: "舒適的凳子",
		description: "你們的漁民站著站得累了",
		type: "craft",
		cost: {
			wood: 160,
			stone: 40,
		},
		duration: 8,
		once: true,
		requirement: ["smithy", 1],
		effect: function (game) {
			game.production.fisherman *= 1.25;
			game.logMessage(
				"event",
				"漁民得到了堅硬的石椅，這是他們用過的最好的椅子，這時，他們聽到了一陣響亮的歡呼聲"
			);
		},
	}),
	new Upgrade({
		name: "貨物儲存",
		description: "將木材裝入標準尺寸的箱子中",
		type: "craft",
		cost: {
			wood: 200,
			stone: 120,
		},
		duration: 10,
		once: true,
		requirement: ["smithy", 2],
		effect: function (game) {
			game.production.lumberjack *= 1.25;
			game.logMessage(
				"event",
				`工匠委員會決定採用一種標準的長度計量單位，
				這棵任意選取的樹的長度為「1根原木」。
				伐木工人現在更容易搬運和儲存木材了`
			);
		},
	}),
	new Upgrade({
		name: "多層礦場",
		description: "垂直擴展你的礦場",
		type: "craft",
		cost: {
			wood: 400,
			stone: 100,
		},
		duration: 10,
		once: true,
		requirement: ["smithy", 2],
		effect: function (game) {
			game.production.miner *= 1.5;
			game.logMessage(
				"event",
				"礦場越深，需要開採的石材就越多，對金絲雀的需求也隨之增加"
			);
		},
	}),
	new Upgrade({
		name: "捕魚陷阱",
		description: "精心設計陷阱，讓魚自投羅網",
		type: "craft",
		cost: {
			wood: 500,
		},
		duration: 12,
		once: true,
		requirement: ["smithy", 3],
		effect: function (game) {
			game.production.fisherman *= 1.5;
			game.logMessage(
				"event",
				"有了魚籠，你的漁民現在可以同時捕捉兩種魚了"
			);
		},
	}),
	new Upgrade({
		name: "背部支撐",
		description: "你們伐木工人的背都因為不停地揮動而痛了",
		type: "craft",
		cost: {
			wood: 300,
			stone: 300,
		},
		duration: 12,
		once: true,
		requirement: ["smithy", 3],
		effect: function (game) {
			game.production.lumberjack * 1.75;
			game.logMessage(
				"event",
				"有了背部支撐，你的伐木工人就像伐木機器一樣"
			);
		},
	}),
	new Upgrade({
		name: "時間管理",
		description:
			"幫助工匠和教授更有效率地管理他們的日常工作",
		type: "research",
		cost: {
			food: 2000,
		},
		duration: 15,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.production.blacksmith -= 0.05;
			game.production.professor -= 0.05;
			game.logMessage(
				"event",
				"制定時間表可以幫助工匠和教授們意識到他們浪費了多少時間"
			);
		},
	}),
	new Upgrade({
		name: "要更聰明地揮動，而不是更用力地揮動",
		description:
			"伐木工課程，教你如何用同樣的努力獲得最大的成果",
		type: "research",
		cost: {
			food: 600,
		},
		duration: 15,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.production.lumberjack *= 2;
			game.logMessage(
				"event",
				"你們的伐木工人砍樹技術好得多。他們似乎還成立了工會"
			);
		},
	}),
	new Upgrade({
		name: "任務掌握",
		description: "你的導師不錯，但還可以更好",
		type: "research",
		cost: {
			food: 3000,
		},
		duration: 16,
		once: true,
		requirement: ["academy", 2],
		effect: function (game) {
			game.production.mentorBoost += 0.1;
			game.logMessage(
				"event",
				"經過長時間的重複練習，你的導師的工作能力也提升了"
			);
		},
	}),

	// Story upgrades
	new Upgrade({
		name: "調查巨石",
		description:
			"黑色的身影高聳入雲，引人注目。它迫使你去仔細觀察",
		type: "craft",
		cost: {
			food: 50,
		},
		duration: 60,
		once: true,
		requirement: ["quarry", 2],
		effect: function (game) {
			game.showStory(
				`你組了一支勘測隊，冒險前往那塊巨石。
				你們花了幾天時間才到達那裡，這足以證明它比從遠處看起來要大得多。
				幸好你們準備了充足的食物。到達之後，彷彿現實在巨石的邊緣戛然而止。
				它的顏色如同閉上雙眼一般，
				這讓你感到深深的不安，你盡可能地將目光移開。
				它的表面光滑無比，你手邊的任何工具都無法鑿開。它是什麼？它為什麼會在這裡？
				這些問題仍然沒有答案，你們的隊伍只好返回家園。`,
				"Return"
			);
		},
	}),
	new Upgrade({
		name: "研究巨石",
		description: "請各位學者考察遠處的建築結構",
		type: "research",
		cost: {
			food: 800,
		},
		duration: 240,
		once: true,
		requirement: ["academy", 2],
		effect: function (game) {
			game.showStory(
				`你召集了村裡最聰明的人，再次冒險前往那塊巨石。
				他們的測量儀器揭示了一個令人擔憂的結果。
				巨石的溫度讀數高達數百萬度
				儘管摸起來涼爽宜人。所有其他測量都失敗了，
				結果要么為零，要么遠遠超出量程
				無論如何，這東西不應該存在於你們的現實世界中，
				更不該擁有如此穩定的狀態，屹立在那裡，冷酷無情，一成不變。
				將所有的能量都累積在自己身上。它怎麼敢如此。`,
				"Leave"
			);
		},
	}),
	new Upgrade({
		name: "**摧毀巨石**",
		description: "它已經困擾地平線太久了",
		type: "research",
		cost: {
			wood: 100000,
			food: 300000,
			stone: 500000,
		},
		duration: 120000,
		once: true,
		requirement: ["academy", 4],
		effect: function (game) {
			game.showStory(
				`陽光明媚，村民們早早起床，
				前往各自的工作場所，一路吟唱著歡快的歌謠。
				但今天是個特別的日子，因為今晚將完成一項重要的任務。
				夕陽西下，眾人默默聚集，沿著狹長的
				小路走向那棟建築。多麼幸運啊，炸藥，最初是為採礦而發明的，
				如今卻能發揮如此重要的作用。`,
				"Advance",
				() => {
					game.showStory(
						`你更近了。就快到了。那可怕的、刺眼的景象，
						遮蔽了你所有的視線，隨著距離的縮短而愈發巨大。
						到達門檻後，炸藥就位。一切都靜了下來。
						時機已到。目的必須達成。工程師把
						扳機遞給你。他跑了起來，踉蹌了一下，頭部撞到地面，裂開了。
						那一刻的喜悅讓他難以承受。並非所有村民都離開了爆炸區域，
						但時間緊迫。`,
						"Trigger",
						() => {
							game.showStory(
								`塵埃如雨般落下。塵埃升騰，又落下。觸鬚
								由巨石構成。它們分裂、融合、充能、重逢。它憤怒了。
								破壞已然發生。我們成功了。一個接一個，刺穿
								心臟。謝謝你，加雷斯。再見，凱特。我太高興了。
								我們一起做到了。觸鬚，如今協調一致。抓住
								我的朋友們。將他們拉入空間終結之處。這無關緊要。
								我們只是偉大計劃中的一顆螺絲釘。可怕的，難以忍受的
								痛苦。我太高興了。我們開始的，其他人會完成。它
								現在正帶走我。無盡的黑暗。它已受損，洪水湧出。
								其他村莊將會出現。時間停止，如今只剩下思想。
								其他人會造成進一步的破壞。偉大的工作即將完成。
								巨石必須倒塌。巨石必須倒塌。`,
								"Game over ... Life forward!",
								() => {
									//game.gameOver();
								}
							);
						}
					);
				}
			);
		},
	}),

	// Random upgrades
	new Upgrade({
		name: "追捕當地野生動物",
		description: "捕捉當地毛茸茸的兔子來充飢",
		type: "craft",
		cost: {
			wood: 5,
			food: 5,
		},
		duration: 2,
		once: true,
		requirement: ["tent", 1],
		effect: function (game) {
			game.food += 40;
			game.logMessage(
				"event",
				"你把兔子全部消滅了。生態系統或許有一天會恢復"
			);
		},
	}),
	new Upgrade({
		name: "砍倒了一棵大橡樹",
		description:
			"砍倒你能找到的最大的一棵樹來增加你的物資",
		type: "craft",
		cost: {
			wood: 20,
		},
		duration: 4,
		once: true,
		requirement: ["pier", 1],
		effect: function (game) {
			game.wood += 100;
			game.logMessage(
				"event",
				"一棵雄偉的橡樹，為戰士和戀人提供蔭涼和慰藉，卻成了你們擴張的最新受害者"
			);
		},
	}),
	new Upgrade({
		name: "平整地面",
		description:
			"村子建在相當不平坦的地面上。也許我們的礦工能幫上忙",
		type: "craft",
		cost: {
			stone: 20,
		},
		duration: 5,
		once: true,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.stone += 120;
			game.logMessage(
				"event",
				"村子現在比以前更平了！好了夥伴們，你們可以把建築物搬回去了"
			);
		},
	}),
	new Upgrade({
		name: "把深海巨獸釣出來",
		description:
			"一條體型巨大的魚一直在恐嚇居民",
		type: "craft",
		cost: {
			food: 40,
		},
		duration: 5,
		once: true,
		requirement: ["quarry", 2],
		effect: function (game) {
			game.food += 200;
			game.logMessage(
				"event",
				"深海巨獸已被消滅，水域再次恢復安全。而且，它的味道還相當不錯"
			);
		},
	}),
	new Upgrade({
		name: "探索基礎知識",
		description:
			"教導村民如何在空閒時間野外生存。也許他們能找到什麼？",
		type: "research",
		cost: {
			wood: 50,
			stone: 50,
			food: 100,
		},
		duration: 10,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.wood += 1000;
			game.stone += 1000;
			game.logMessage(
				"event",
				"上週末，你的村民們進行了一次冒險。他們發現了一個被遺棄的營地，裡面有很多物資！可惜的是，所有的食物都腐爛了"
			);
		},
	}),
	new Upgrade({
		name: "外來部落",
		description:
			"學習如何與附近友善且不干涉他們生活的部落交流",
		type: "research",
		cost: {
			food: 400,
		},
		duration: 15,
		once: true,
		requirement: ["academy", 2],
		effect: function (game) {
			game.wood += 1600;
			game.stone += 1600;
			game.food += 800;
			game.logMessage(
				"event",
				"這個友善的部落同意以物易物！他們欣然接受了一堆零零碎碎的小玩意兒，並提供了大量的物資作為交換"
			);
		},
	}),
];
