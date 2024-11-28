console.log("main.js!!");
document.addEventListener("DOMContentLoaded", function () {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // 一度表示された要素は監視を解除
            }
        });
    }, { threshold: 0.1 }); // 表示領域に10%入ったら表示

    fadeElements.forEach(element => observer.observe(element));
});

document.addEventListener("DOMContentLoaded", function () {
    // フェードインさせたい要素を取得
    const fadeElements = document.querySelectorAll('.fade-in');

    // スクロール時のイベントリスナーを追加
    window.addEventListener('scroll', function () {
        fadeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                element.classList.add('show');
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // フェードイン・アウトさせたい要素を取得
    const fadeElements = document.querySelectorAll('.fade-in-out');

    // スクロール時のイベントリスナーを追加
    window.addEventListener('scroll', function () {
        fadeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // 要素が画面内に入るとフェードイン
            if (rect.top < windowHeight - 100 && rect.bottom > 100) {
                element.classList.add('show');
            } else {
                // 要素が画面外に出るとフェードアウト
                element.classList.remove('show');
            }
        });
    });
});

document.querySelectorAll('.icon').forEach((icon, index) => {
    icon.style.animationDelay = `${index * 0.5}s`; // アイコンごとに遅延を追加
});

document.addEventListener("DOMContentLoaded", function () {
    const icon = document.querySelector(".moving-icon");
    const container = document.querySelector(".icon-container");

    // コンテナとアイコンのサイズを取得
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const iconWidth = icon.clientWidth;
    const iconHeight = icon.clientHeight;

    // 初期位置と速度
    let posX = Math.random() * (containerWidth - iconWidth);
    let posY = Math.random() * (containerHeight - iconHeight);
    let speedX = 2; // X方向の速度
    let speedY = 2; // Y方向の速度

    // アイコンの位置を更新する関数
    function moveIcon() {
        posX += speedX;
        posY += speedY;

        // 左または右の壁に衝突した場合、X方向の速度を反転
        if (posX <= 0 || posX >= containerWidth - iconWidth) {
            speedX = -speedX;
        }

        // 上または下の壁に衝突した場合、Y方向の速度を反転
        if (posY <= 0 || posY >= containerHeight - iconHeight) {
            speedY = -speedY;
        }

        // アイコンの位置を更新
        icon.style.left = `${posX}px`;
        icon.style.top = `${posY}px`;

        requestAnimationFrame(moveIcon);
    }

    // アニメーションを開始
    moveIcon();
});


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
let scores = JSON.parse(localStorage.getItem("scores")) || [];

let score = 0;
let isGameOver = false;
let isGameStarted = false;


// 画像をロード
const playerImage = new Image();
playerImage.src = "images/CHIKAWA.png"; // プレイヤーの画像

const enemyImage = new Image();
enemyImage.src = "images/GURASANCHIKAWA.png"; // 敵の画像

// プレイヤーの設定
const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5, // プレイヤーの移動速度
};

// 弾や敵のリスト
const bullets = [];
const enemies = [];

// 発射間隔の設定
let lastShootTime = 0;
const shootInterval = 300; // 300ミリ秒間隔で発射

function createEnemy() {
    if (!isGameStarted || isGameOver) return;
    const x = Math.random() * (canvas.width - 50);
    enemies.push({ x, y: -50, width: 50, height: 50, speed: 2 });
    setTimeout(createEnemy, 1000); // 敵を1秒ごとに生成
}

function drawObject(obj, image) {
    ctx.drawImage(image, obj.x, obj.y, obj.width, obj.height);
}

function update() {
    if (!isGameStarted || isGameOver) return;

    // 背景色を変更（例: 背景色をライトグレーにする）
    ctx.fillStyle = "#D3D3D3"; // 背景色の設定（ライトグレー）
    ctx.fillRect(0, 0, canvas.width, canvas.height); // 画面全体を塗りつぶす

    // プレイヤーを描画
    drawObject(player, playerImage);

    // 弾の更新と描画
    bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        if (bullet.y < 0) bullets.splice(index, 1);
        ctx.fillStyle = "black"; // 弾の色
        ctx.beginPath();
        ctx.arc(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2, bullet.width / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // 敵の更新と描画
    enemies.forEach((enemy, enemyIndex) => {
        enemy.y += enemy.speed;

        // 敵と弾の衝突判定
        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.height + bullet.y > enemy.y
            ) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 10;
                document.getElementById("score").innerText = score;
            }
        });

        // 敵とプレイヤーの衝突判定
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.height + player.y > enemy.y
        ) {
            isGameOver = true;
            alert("ゲームオーバー！スコア: " + score);
            canvas.style.display = "none";
            startButton.style.display = "inline-block";
        }

        // 敵が画面の下に到達した場合、ゲームオーバー
        if (enemy.y > canvas.height) {
            isGameOver = true;
            alert("ゲームオーバー！スコア: " + score);
            canvas.style.display = "none";
            startButton.style.display = "inline-block";
        }

        // 画面外に出た敵を削除
        if (enemy.y > canvas.height) {
            enemies.splice(enemyIndex, 1);
        }

        drawObject(enemy, enemyImage);
    });

    requestAnimationFrame(update);
}

startButton.addEventListener("click", () => {
    score = 0;
    isGameOver = false;
    isGameStarted = true;

    // 初期化
    enemies.length = 0;
    bullets.length = 0;

    // ゲームを開始
    startButton.style.display = "none";
    canvas.style.display = "block";
    createEnemy();
    update();
});

// キーボード操作
let moveLeft = false;
let moveRight = false;
let shoot = false;

window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "a") {
        moveLeft = true;
    }
    if (event.key === "ArrowRight" || event.key === "d") {
        moveRight = true;
    }
    if (event.key === " " || event.key === "Enter") {
        shoot = true; // SpaceキーかEnterキーで発射
    }
});

window.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft" || event.key === "a") {
        moveLeft = false;
    }
    if (event.key === "ArrowRight" || event.key === "d") {
        moveRight = false;
    }
    if (event.key === " " || event.key === "Enter") {
        shoot = false; // 長押しを解除すると発射を止める
    }
});

function movePlayer() {
    if (moveLeft && player.x > 0) {
        player.x -= player.speed; // 左に移動
    }
    if (moveRight && player.x < canvas.width - player.width) {
        player.x += player.speed; // 右に移動
    }
}

// プレイヤーの移動
function update() {
    if (!isGameStarted || isGameOver) return;

    movePlayer(); // プレイヤーを動かす

    // 弾の発射（連続発射）
    const now = Date.now();
    if (shoot && now - lastShootTime > shootInterval) {
        bullets.push({ x: player.x + player.width / 2 - 5, y: player.y, width: 10, height: 10 }); // 丸い弾
        lastShootTime = now; // 発射した時刻を更新
    }

    // 背景色を変更（例: 背景色をライトグレーにする）
    ctx.fillStyle = "#D3D3D3"; // 背景色の設定（ライトグレー）
    ctx.fillRect(0, 0, canvas.width, canvas.height); // 画面全体を塗りつぶす

    // プレイヤーを描画
    drawObject(player, playerImage);

    // 弾の更新と描画
    bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        if (bullet.y < 0) bullets.splice(index, 1);
        ctx.fillStyle = "black"; // 弾の色
        ctx.beginPath();
        ctx.arc(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2, bullet.width / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // 敵の更新と描画
    enemies.forEach((enemy, enemyIndex) => {
        enemy.y += enemy.speed;

        // 敵と弾の衝突判定
        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.height + bullet.y > enemy.y
            ) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 10;
                document.getElementById("score").innerText = score;
            }
        });

        // 敵とプレイヤーの衝突判定
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.height + player.y > enemy.y
        ) {
            isGameOver = true;
            alert("ゲームオーバー！スコア: " + score);
            canvas.style.display = "none";
            startButton.style.display = "inline-block";
        }

        // 敵が画面の下に到達した場合、ゲームオーバー
        if (enemy.y > canvas.height) {
            isGameOver = true;
            alert("ゲームオーバー！スコア: " + score);
            canvas.style.display = "none";
            startButton.style.display = "inline-block";
        }

        // 画面外に出た敵を削除
        if (enemy.y > canvas.height) {
            enemies.splice(enemyIndex, 1);
        }

        drawObject(enemy, enemyImage);
    });

    requestAnimationFrame(update);
}

/// スコアボードを更新する関数
function updateScoreBoard() {
    const scoreList = document.getElementById("scoreList");
    scoreList.innerHTML = ""; // リストをリセット

    // ローカルストレージから取得したスコアを降順で並べ替え
    const sortedScores = scores.sort((a, b) => b - a); // 降順にソート

    // スコアが10個を超えていたら、最も低いスコアを削除
    if (sortedScores.length > 10) {
        sortedScores.pop(); // 最も低いスコア（配列の最後の要素）を削除
    }

    // スコアをリストに追加
    sortedScores.forEach(score => {
        const listItem = document.createElement("li");
        listItem.textContent = `スコア: ${score}`;
        scoreList.appendChild(listItem);
    });

    // スコアボードをローカルストレージに保存
    localStorage.setItem("scores", JSON.stringify(sortedScores));
}

// 新しいスコアをスコアリストに追加する関数
function addScore(score) {
    // スコアを配列に追加
    scores.push(score);

    // スコアが10個を超えている場合、最も低いスコアを削除
    if (scores.length > 10) {
        scores.sort((a, b) => b - a); // 降順に並べ替え
        scores.pop(); // 最も低いスコアを削除
    }

    // スコアボードを更新
    updateScoreBoard();
}

// ゲーム終了後にスコアを追加する例
function onGameOver(finalScore) {
    addScore(finalScore);
}

// ページロード時にスコアボードを更新
document.addEventListener("DOMContentLoaded", function () {
    updateScoreBoard(); // ページ読み込み時にスコアボードを更新
});
// ゲームのメインループ
function update() {
    if (!isGameStarted || isGameOver) return;

    movePlayer(); // プレイヤーを動かす

    const now = Date.now();
    if (shoot && now - lastShootTime > shootInterval) {
        bullets.push({ x: player.x + player.width / 2 - 5, y: player.y, width: 10, height: 10 });
        lastShootTime = now;
    }

    ctx.fillStyle = "#D3D3D3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawObject(player, playerImage);

    bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        if (bullet.y < 0) bullets.splice(index, 1);
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2, bullet.width / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    enemies.forEach((enemy, enemyIndex) => {
        enemy.y += enemy.speed;

        // 衝突判定
        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.height + bullet.y > enemy.y
            ) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 10;  // スコア加算
                document.getElementById("score").innerText = score;  // 画面上のスコアを更新
            }
        });

        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.height + player.y > enemy.y
        ) {
            isGameOver = true;
            // スコアをローカルストレージに保存
            scores.push(score);
            localStorage.setItem('gameScores', JSON.stringify(scores));

            alert("ゲームオーバー！スコア: " + score);
            canvas.style.display = "none";
            startButton.style.display = "inline-block";

            updateScoreBoard();  // スコアボードの更新
        }

        if (enemy.y > canvas.height) {
            isGameOver = true;
            // スコアをローカルストレージに保存
            scores.push(score);
            localStorage.setItem('gameScores', JSON.stringify(scores));

            alert("ゲームオーバー！スコア: " + score);
            canvas.style.display = "none";
            startButton.style.display = "inline-block";

            updateScoreBoard();  // スコアボードの更新
        }

        drawObject(enemy, enemyImage);
    });

    requestAnimationFrame(update);
}
// ゲームが開始されたときに、スコアボードを最初に表示
updateScoreBoard();