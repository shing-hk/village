// tutorial.js
// Extends the Game class with tutorial handling
// Keeps track of which pop-ups were already shown, their contents, and their
// requirements, as well as handling the actual display

"use strict";

// List of all possible pop-ups
// Value is true if shown
Game.prototype.tutorial = {
	resource: false,
	tent: false,
	assign: false,
	pier: false,
	chaos: false,
	stone: false,
	smithy: false,
	academy: false,
	mentor: false,
	manager: false,
};

// Show the relevant pop-up if a requirement has been meet
// Call this every update
Game.prototype.updatePopups = function () {
	if (this.wood >= 4 && !this.tutorial.resource) {
		this.showPopup(
			`您目前的資源數量顯示在此`,
			"#warehouse"
		);
		this.tutorial.resource = true;
	}
	if (this.wood >= 10 && this.food >= 10 && !this.tutorial.tent) {
		this.showPopup(
			`不錯！你現在有足夠的資源建造你的第一個帳篷了。
			這將邀請兩位村民來到你的村莊。他們將
			自動成為伐木工，為你生產木材。
			點擊升級清單中的「建造帳篷」即可開始建造。`,
			"#craft"
		);
		this.tutorial.tent = true;
	}
	if (this.levels.tent >= 1 && !this.tutorial.assign) {
		this.showPopup(
			`現在你有了帳篷，你的村莊裡有兩名伐木工，
			你可以在新解鎖的「分配」標籤頁中看到他們。
			點擊「製作」標籤頁返回可用升級列表，看看你能不能建造一個釣魚碼頭。
			沿途也別忘了製作其他有用的物品！`,
			"#assign",
			"assign"
		);
		this.tutorial.assign = true;
	}
	if (this.levels.pier >= 1 && !this.tutorial.pier) {
		this.showPopup(
			`漁碼頭建成後，現在可以指派一些
			村民去當漁夫，他們會隨著時間推移生產食物。使用“+”
			和“-”按鈕來更改指派。任何未被指派的
			村民仍會為您採集木材。`,
			"#assign",
			"assign"
		);
		this.tutorial.pier = true;
	}
	if (this.chaos.pier > 0 && !this.tutorial.chaos) {
		this.showPopup(
			`糟糕！有兩個村民同時負責碼頭，看起來
			他們經常互相干擾。你指派的村民越多，
			他們的工作場所就越混亂，
			生產速度就越慢。你可以在「混亂」一欄中看到速度減慢的程度。
			盡量減少混亂，以最大限度地利用你的村莊。`,
			"#assign"
		);
		this.tutorial.chaos = true;
	}
	if (this.levels.quarry >= 1 && !this.tutorial.stone) {
		this.showPopup(
			`礦場建成後，你解鎖了一種新的
			資源！派遣礦工開始採集石頭。你還有可能
			透過升級現有建築發現新的工藝...`,
			"#warehouse"
		);
		this.tutorial.stone = true;
	}
	if (this.levels.smithy >= 1 && !this.tutorial.smithy) {
		this.showPopup(
			`你有沒有注意到製作物品所需的時間越來越長？
			指派鐵匠協助你製作物品，可以顯著加快製作速度。
			速度提升幅度顯示在資源數量旁。`,
			"#warehouse"
		);
		this.tutorial.smithy = true;
	}
	if (this.levels.academy >= 1 && !this.tutorial.academy) {
		this.showPopup(
			`村莊學院現已建成！一種全新的升級方式
			已解鎖—研究，您可以透過新增的
			“研究”標籤頁訪問。您現在還可以指派教授來加快
			研究進度，就像鐵匠加快製作速度。`,
			"#research",
			"research"
		);
		this.tutorial.academy = true;
	}
	if (this.unlocks.mentor && !this.tutorial.mentor) {
		this.showPopup(
			`恭喜！現在您可以為每個工作分配導師了！導師
			不僅比一般村民生產效率更高，而且他們
			還可以收村民為徒。每對導師
			和村民在計算混亂值時都只算作一個人，這有助於您在不導致管理不善的情況下擴大工作場所規模。`,
			"#assign",
			"assign"
		);
		this.tutorial.mentor = true;
	}
	if (this.unlocks.manager && !this.tutorial.manager) {
		this.showPopup(
			`這就是團隊管理的尖端技術。有了經理，你的團隊
			生產力將達到前所未有的高度！當然，
			經理本身並不生產任何東西，但經理越多，
			團隊的混亂程度就越低。潛力無限！不久之後，
			或許你就能著手解決地平線上那塊巨石了。...`,
			"#assign",
			"assign"
		);
		this.tutorial.manager = true;
	}
};

// Show a pop-up to the player by modifying the DOM, with a small delay
// text: Main pop-up content plaintext
// atSelector (optional): CSS selector of a DOM element next to which the pop-up
//   will be placed. If undefined, pop-up will be centered
// switchTab (optional): name of an interface tab. If defined, the tab will be
//   activated when the pop-up appears
Game.prototype.showPopup = function (text, atSelector, switchTab) {
	setTimeout(() => {
		this.dom.popupShroud.style.display = "block";
		this.dom.popupText.textContent = text;

		// Switch the tab first in case it contains the atSelector element
		if (switchTab) this.dom[switchTab + "Button"].click();

		if (atSelector) {
			let target = document.querySelector(atSelector);
			const targetRect = target.getBoundingClientRect();
			const margin = parseInt(
				window.getComputedStyle(this.dom.popup).marginTop
			);

			// Determine if we're portrait or landscape
			const isPortrait = window.innerWidth >= window.innerHeight;

			// Start out overlapping the target
			let left = targetRect.left;
			let top = targetRect.top;

			if (isPortrait) {
				// Try positioning to the right of the target,
				// go to the left if that's off-screen
				left += target.offsetWidth;
				if (
					left + margin + this.dom.popup.offsetWidth >
					window.innerWidth
				)
					left =
						targetRect.left -
						margin * 2 -
						this.dom.popup.offsetWidth;
			} else {
				// Try positioning below the target,
				// go above if that's off-screen
				top += target.offsetHeight;
				if (
					top + margin + this.dom.popup.offsetHeight >
					window.innerHeight
				)
					top =
						targetRect.top -
						margin * 2 -
						this.dom.popup.offsetHeight;
			}

			// Clamp pop-up position to viewport, just in case
			left = Math.max(left, 0);
			left = Math.min(
				left,
				window.innerWidth - this.dom.popup.offsetWidth - margin * 2
			);
			top = Math.max(top, 0);
			top = Math.min(
				top,
				window.innerHeight - this.dom.popup.offsetHeight - margin * 2
			);

			this.dom.popup.style.left = left + "px";
			this.dom.popup.style.top = top + "px";

			target.style.zIndex = 1000; // Bring above the shroud (z 0) but below the pop-up (z 2000)
			target.style.pointerEvents = "none"; // Make sure target can't be interacted with while pop-up is visible
			this.dom.popupDismiss.addEventListener("click", () => {
				target.style.zIndex = "revert";
				target.style.pointerEvents = "revert";
			});
		} else {
			// Default - just center it
			this.dom.popup.style.left =
				window.innerWidth / 2 - this.dom.popup.offsetWidth / 2 + "px";
			this.dom.popup.style.top =
				window.innerHeight / 2 - this.dom.popup.offsetHeight / 2 + "px";
		}
	}, 800);
};
