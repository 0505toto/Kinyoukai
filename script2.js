// ページのすべての要素が読み込まれてから処理を開始します
document.addEventListener('DOMContentLoaded', () => {

    // --- 必要な要素を取得 ---
    const addAgendaForm = document.getElementById('add-agenda-form');
    const agendaList = document.getElementById('agenda-list');
    const topicInput = document.getElementById('topic');
    const presenterInput = document.getElementById('presenter');
    const timeInput = document.getElementById('time');

    // --- メインの処理：フォームが送信されたときのイベント ---
    addAgendaForm.addEventListener('submit', (event) => {
        // フォームのデフォルトの送信動作（ページのリロード）を防ぐ
        event.preventDefault();

        // 入力された値を取得（.trim()で前後の空白を削除）
        const topic = topicInput.value.trim();
        const presenter = presenterInput.value.trim();
        const time = timeInput.value.trim();

        // 必須項目が入力されているかチェック
        if (topic === '' || presenter === '' || time === '') {
            alert('すべての項目を入力してください！');
            return;
        }

        // 議題リストに新しい項目を追加する関数を呼び出す
        addAgendaItem(topic, presenter, time);

        // フォームの入力内容をリセットして、次の入力に備える
        addAgendaForm.reset();
        
        // 最初の入力欄にフォーカスを戻す
        topicInput.focus();
    });

    // --- 議題リスト内のクリックイベント（削除ボタン用）---
    // リスト全体を監視し、クリックされたのが削除ボタンの場合のみ処理を実行
    agendaList.addEventListener('click', (event) => {
        // クリックされた要素が 'btn-delete' クラスを持っているかチェック
        if (event.target.classList.contains('btn-delete')) {
            // 削除ボタンの親要素である li 要素を取得
            const listItem = event.target.closest('li');
            
            // 削除アニメーション用のクラスを追加
            listItem.classList.add('removing');

            // アニメーションが終わったタイミングで要素を完全に削除
            listItem.addEventListener('animationend', () => {
                listItem.remove();
            });
        }
    });

    /**
     * 新しい議題をリストに追加する関数
     * @param {string} topic - 議題の内容
     * @param {string} presenter - 発表者
     * @param {string} time - 時間
     */
    function addAgendaItem(topic, presenter, time) {
        // 新しい li 要素を作成
        const listItem = document.createElement('li');

        // li 要素の中身をHTMLで作成（バッククォート ` ` を使うと複数行の文字列を書きやすい）
        listItem.innerHTML = `
            <div class="agenda-content">
                <span class="agenda-topic"><strong>議題:</strong> ${topic}</span>
                <span class="agenda-presenter"><strong>発表者:</strong> ${presenter}</span>
                <span class="agenda-time"><strong>時間:</strong> ${time} 分</span>
            </div>
            <button class="btn-delete" title="この議題を削除">✖</button>
        `;

        // 作成した li 要素を議題リスト (ul) の子として追加
        agendaList.appendChild(listItem);
    }
});
