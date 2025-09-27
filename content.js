// Scope.gg Compilation Helper - Content Script

(function() {
    'use strict';

    // Check if script is already injected
    if (window.scopeHelperInjected) {
        return;
    }
    window.scopeHelperInjected = true;

    // Styles for the modal window
    const css = `
      #scopeggModal {
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      #modalContent {
        position: relative;
        background-color: #2c2f33;
        padding: 20px;
        border-radius: 10px;
        width: 90%;
        max-width: 700px;
        max-height: 80%;
        overflow-y: auto;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        color: #ffffff;
        border: 1px solid #4f545c;
      }
      #closeModal {
        position: absolute;
        top: 10px;
        right: 15px;
        color: #b9bbbe;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        transition: color 0.2s;
      }
      #closeModal:hover {
        color: #f04747;
      }
      #modalContent h2 {
        text-align: center;
        color: #7289da;
        margin-top: 0;
      }
      #listContainer {
        list-style-type: none;
        padding: 0;
      }
      .listItem {
        background-color: #36393f;
        margin-bottom: 10px;
        padding: 15px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      .listItem:hover {
        background-color: #40444b;
      }
      .listItem-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        margin-bottom: 5px;
      }
      .listItem-details {
        font-size: 0.9em;
        color: #b9bbbe;
      }
      .listItem-stats {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #4f545c;
        display: flex;
        justify-content: space-around;
        text-align: center;
      }
      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .stat-value {
        font-weight: bold;
        color: #99aab5;
      }
      .stat-label {
        font-size: 0.8em;
        color: #72767d;
      }
      #modalContent::-webkit-scrollbar {
        width: 8px;
      }
      #modalContent::-webkit-scrollbar-track {
        background: #2c2f33;
      }
      #modalContent::-webkit-scrollbar-thumb {
        background-color: #7289da;
        border-radius: 20px;
        border: 2px solid #2c2f33;
      }
      .loading-text, .message-text {
        color: #99aab5;
        text-align: center;
        padding: 20px;
      }
      .team-score {
          font-size: 1.2em;
          font-weight: bold;
      }
      .team-win {
          color: #43b581;
      }
      .team-loss {
          color: #f04747;
      }
      .player-stats {
          font-weight: bold;
          color: #7289da;
      }
      .progress-bar {
          width: 100%;
          background-color: #36393f;
          border-radius: 5px;
          overflow: hidden;
          margin-top: 10px;
      }
      .progress-bar-fill {
          height: 20px;
          background-color: #7289da;
          text-align: center;
          line-height: 20px;
          color: white;
          transition: width 0.4s ease-in-out;
      }
      .team-0 { 
          border-left: 5px solid #43b581;
      }
      .team-1 { 
          border-left: 5px solid #ff9900;
      }
      .player-team-label {
          font-size: 0.8em;
          color: #72767d;
          margin-left: 10px;
      }
      .team-header {
        font-size: 1.1em;
        font-weight: bold;
        color: #7289da;
        margin-top: 20px;
        margin-bottom: 5px;
        padding-left: 10px;
      }
      .options-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 20px;
          padding: 15px;
          background-color: #36393f;
          border-radius: 8px;
      }
      .checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
      }
      .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
      }
      .start-button, .new-compilation-button {
        background-color: #7289da;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 1em;
        cursor: pointer;
        transition: background-color 0.2s;
        margin-top: 15px;
      }
      .start-button:hover, .new-compilation-button:hover {
        background-color: #5b6eae;
      }
      .start-button:disabled {
        background-color: #4f545c;
        cursor: not-allowed;
      }
      .report-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-top: 20px;
      }
      .match-report {
        background-color: #36393f;
        padding: 15px;
        border-radius: 8px;
      }
      .match-report h3 {
        color: #7289da;
        margin-top: 0;
      }
      .video-grid {
        display: flex;
        gap: 20px;
        justify-content: space-around;
        margin-top: 10px;
      }
      .video-column {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 50%;
        align-items: center;
      }
      .video-column h4 {
        text-align: center;
      }
      .video-card {
        background-color: #2c2f33;
        padding: 10px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 100%;
        box-sizing: border-box;
      }
      .video-card p {
        margin: 0;
        font-size: 0.9em;
        color: #b9bbbe;
      }
      .video-card video {
        width: 100%;
        border-radius: 5px;
      }
      .video-card .actions {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 5px;
      }
      .video-card .actions button {
        background-color: #7289da;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 0.8em;
        cursor: pointer;
      }
      .video-card .actions button:hover {
        background-color: #5b6eae;
      }
      .alert-message {
        background-color: #ff9900;
        color: #36393f;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
        text-align: center;
      }
      .alert-actions {
        display: flex;
        justify-content: space-around;
        margin-top: 10px;
      }
      .alert-actions button {
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .alert-actions .confirm {
        background-color: #43b581;
        color: white;
      }
      .alert-actions .cancel {
        background-color: #f04747;
        color: white;
      }
      .main-report-list .list-item {
          background-color: #36393f;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: background-color 0.2s;
      }
      .main-report-list .list-item:hover {
          background-color: #40444b;
      }
      .main-report-list .list-item p {
          margin: 0;
          font-weight: bold;
      }
      .main-report-list .list-item small {
          color: #b9bbbe;
      }
      .extension-trigger {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #7289da;
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        z-index: 9999;
      }
      .extension-trigger:hover {
        background-color: #5b6eae;
        transform: scale(1.1);
      }
    
    .delete-button {
        background-color: #f04747 !important;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 5px;
        font-size: 0.9em;
        cursor: pointer;
        margin-top: 10px;
        transition: background-color 0.2s;
    }
    .delete-button:hover {
        background-color: #d83c3c !important;
    }
    .confirmation-dialog {
        background-color: #36393f;
        padding: 15px;
        border-radius: 8px;
        margin-top: 15px;
        border-left: 4px solid #f04747;
    }
    .confirmation-buttons {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }
    .confirmation-buttons button {
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .confirm-delete {
        background-color: #f04747;
        color: white;
    }
    .cancel-delete {
        background-color: #99aab5;
        color: white;
    }
      `;

    function deleteClips(clipIds) {
        try {
            const clips = getSavedClips();
            const updatedClips = clips.filter(clip => !clipIds.includes(clip.clipId));
            localStorage.setItem('scopegg_compilations', JSON.stringify(updatedClips));
            return true;
        } catch (e) {
            console.error("Ошибка при удалении клипов:", e);
            return false;
        }
    }
    // Inject styles
    function injectStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);
    }

    function createModal(title) {
        const existingModal = document.getElementById("scopeggModal");
        if (existingModal) {
            document.body.removeChild(existingModal);
        }

        const modal = document.createElement("div");
        modal.id = "scopeggModal";
        modal.innerHTML = `
            <div id="modalContent">
                <span id="closeModal">&times;</span>
                <h2>${title}</h2>
                <div id="loadingText" class="loading-text">Загрузка...</div>
                <ul id="listContainer"></ul>
            </div>
        `;
        document.body.appendChild(modal);

        const closeButton = modal.querySelector('#closeModal');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        return modal;
    }

    function showMessage(message, isError = false) {
        const modal = createModal("Сообщение");
        const modalContent = modal.querySelector('#modalContent');
        modalContent.innerHTML = `<span id="closeModal">&times;</span><div class="message-text">${message}</div>`;
        modal.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        if (isError) {
            modalContent.style.borderColor = '#f04747';
        }
    }

    function showNotification(message, isError = false) {
        // Создаем уведомление, которое не закрывает основное окно
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${isError ? '#f04747' : '#43b581'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Автоматическое скрытие через 3 секунды
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        // Возможность закрыть по клику
        notification.addEventListener('click', () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });
    }

    function showProgressModal() {
        const modal = createModal("Запись компиляций...");
        const modalContent = modal.querySelector('#modalContent');
        modalContent.innerHTML = `
            <span id="closeModal">&times;</span>
            <h2>Запись компиляций...</h2>
            <div id="progressStatus" class="message-text"></div>
            <div class="progress-bar">
                <div id="progressBarFill" class="progress-bar-fill" style="width: 0%;">0%</div>
            </div>
        `;
        return {
            update: (current, total, message) => {
                const percentage = Math.round((current / total) * 100);
                modal.querySelector('#progressStatus').innerText = message;
                const progressBarFill = modal.querySelector('#progressBarFill');
                progressBarFill.style.width = `${percentage}%`;
                progressBarFill.innerText = `${percentage}%`;
            },
            close: () => {
                try {
                    document.body.removeChild(modal);
                } catch (error) {
                    console.error("Ошибка при закрытии модального окна:", error);
                }
            }
        };
    }

    function showMainReportModal() {
        const modal = createModal("Ваши компиляции");
        const modalContent = modal.querySelector('#modalContent');
        modalContent.innerHTML = `
            <span id="closeModal">&times;</span>
            <h2>Ваши компиляции</h2>
            <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                <button id="newCompilationButton" class="new-compilation-button">Создать новую компиляцию</button>
                <button id="viewByMatchButton" class="new-compilation-button">По матчам</button>
                <button id="exportDataButton" class="new-compilation-button">📥 Экспорт данных</button>
            </div>
            <div class="report-container" id="reportContainer"></div>
        `;

        const reportContainer = modalContent.querySelector('#reportContainer');
        const newCompilationButton = modalContent.querySelector('#newCompilationButton');
        const viewByMatchButton = modalContent.querySelector('#viewByMatchButton');
        const exportDataButton = modalContent.querySelector('#exportDataButton');
        
        newCompilationButton.addEventListener('click', () => {
            document.body.removeChild(modal);
            startNewCompilation();
        });

        viewByMatchButton.addEventListener('click', () => {
            document.body.removeChild(modal);
            showMatchesViewModal();
        });

        exportDataButton.addEventListener('click', () => {
            exportCompilationData();
        });

        // Показываем загрузку
        reportContainer.innerHTML = `<div class="loading-text">Загрузка матчей...</div>`;
        
        // Загружаем матчи и компиляции
        loadMatchesWithCompilations(reportContainer, modal);

        modal.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    function showDetailedReportModal(playerData) {
        const modal = createModal(`Отчет для ${playerData.playerName}`);
        const modalContent = modal.querySelector('#modalContent');
        
        // Получаем название матча из первого клипа
        const matchTitle = playerData.clips.length > 0 ? playerData.clips[0].matchTitle : 'Неизвестный матч';
        
        modalContent.innerHTML = `
            <span id="closeModal" class="back-button">&times;</span>
            <h2>${matchTitle}</h2>
            <div class="report-container">
                <div class="video-grid">
                    <div class="video-column">
                        <h4>POV игрока</h4>
                        <button id="copyPlayerPovBtn" class="start-button" style="margin-bottom: 10px; width: 100%;">📋 Скопировать данные</button>
                        <div id="playerPovColumn"></div>
                    </div>
                    <div class="video-column">
                        <h4>POV оппонента</h4>
                        <button id="copyOpponentPovBtn" class="start-button" style="margin-bottom: 10px; width: 100%;">📋 Скопировать данные</button>
                        <div id="opponentPovColumn"></div>
                    </div>
                </div>
                <div id="deleteSection" style="margin-top: 20px; padding: 15px; background-color: #36393f; border-radius: 8px;">
                    <h3 style="color: #f04747; margin-top: 0;">Управление компиляцией</h3>
                    <p style="margin-bottom: 10px; color: #b9bbbe;">Здесь вы можете удалить все клипы этой компиляции</p>
                    <button id="deleteCompilationBtn" class="delete-button">🗑️ Удалить компиляцию</button>
                    <div id="deleteConfirmation" class="confirmation-dialog" style="display: none;">
                        <p style="color: #f04747; font-weight: bold;">⚠️ Вы уверены, что хотите удалить эту компиляцию?</p>
                        <p style="color: #b9bbbe;">Будет удалено ${playerData.clips.length} клипов. Это действие нельзя отменить.</p>
                        <div class="confirmation-buttons">
                            <button id="confirmDeleteBtn" class="confirm-delete">Да, удалить</button>
                            <button id="cancelDeleteBtn" class="cancel-delete">Отмена</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    
        const playerColumn = modalContent.querySelector('#playerPovColumn');
        const opponentColumn = modalContent.querySelector('#opponentPovColumn');
        const copyPlayerPovBtn = modalContent.querySelector('#copyPlayerPovBtn');
        const copyOpponentPovBtn = modalContent.querySelector('#copyOpponentPovBtn');
        const deleteButton = modalContent.querySelector('#deleteCompilationBtn');
        const deleteConfirmation = modalContent.querySelector('#deleteConfirmation');
        const confirmDeleteBtn = modalContent.querySelector('#confirmDeleteBtn');
        const cancelDeleteBtn = modalContent.querySelector('#cancelDeleteBtn');
    
        const playerClips = playerData.clips.filter(c => c.type === 'playerPov');
        const opponentClips = playerData.clips.filter(c => c.type === 'opponentPov');
        const allClipIds = playerData.clips.map(c => c.clipId);
    
        // Обработчики кнопок копирования
        copyPlayerPovBtn.addEventListener('click', () => {
            copyClipsToClipboard(playerClips, 'POV игрока');
        });
    
        copyOpponentPovBtn.addEventListener('click', () => {
            copyClipsToClipboard(opponentClips, 'POV оппонента');
        });
    
        // Обработчики удаления
        deleteButton.addEventListener('click', () => {
            deleteConfirmation.style.display = 'block';
            deleteButton.style.display = 'none';
        });
    
        confirmDeleteBtn.addEventListener('click', () => {
            const success = deleteClips(allClipIds);
            if (success) {
                showNotification(`Удалено ${playerData.clips.length} клипов компиляции`);
                document.body.removeChild(modal);
                showMainReportModal();
            } else {
                showNotification('Ошибка при удалении компиляции', true);
                deleteConfirmation.style.display = 'none';
                deleteButton.style.display = 'block';
            }
        });
    
        cancelDeleteBtn.addEventListener('click', () => {
            deleteConfirmation.style.display = 'none';
            deleteButton.style.display = 'block';
        });
    
        // Скрываем кнопки, если нет клипов
        if (playerClips.length === 0) {
            copyPlayerPovBtn.style.display = 'none';
        }
        if (opponentClips.length === 0) {
            copyOpponentPovBtn.style.display = 'none';
        }
    
        playerClips.forEach(clip => {
            playerColumn.appendChild(createVideoCard(clip));
        });
        if (playerClips.length === 0) {
            playerColumn.innerHTML += `<p class="message-text">Нет видео</p>`;
        }
    
        opponentClips.forEach(clip => {
            opponentColumn.appendChild(createVideoCard(clip));
        });
        if (opponentClips.length === 0) {
            opponentColumn.innerHTML += `<p class="message-text">Нет видео</p>`;
        }
    
        modal.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
            showMainReportModal();
        });
    }

    function createVideoCard(clip) {
        const card = document.createElement('div');
        card.className = 'video-card';
        const videoUrl = `https://hl.xplay.cloud/video/${clip.clipId}.mp4`;
        
        // Получаем информацию о настройках
        let settingsInfo = '';
        if (clip.settings) {
            const povType = clip.settings.opponentPov ? 'POV оппонента' : 'POV игрока';
            settingsInfo = `
                <div style="margin-top: 8px; padding: 8px; background-color: #40444b; border-radius: 4px; font-size: 0.8em;">
                    <strong>Настройки:</strong><br>
                    • ${povType}<br>
                    • Wallhack: ${clip.settings.wallHack ? 'Включен' : 'Выключен'}<br>
                    • Голосовой чат: ${clip.settings.voiceChat ? 'Включен' : 'Выключен'}<br>
                    • HUD: ${clip.settings.HUD ? 'Включен' : 'Выключен'}<br>
                    • Соотношение сторон: ${clip.settings.aspectRatio || '16:9'}
                    ${clip.eventType ? `<br>• Тип событий: ${getEventTypeText(clip.eventType)}` : ''}
                    ${clip.createdAt ? `<br>• Создано: ${formatDate(new Date(clip.createdAt))}` : ''}
                </div>
            `;
        }
        
        card.innerHTML = `
            <p><strong>${clip.title}</strong></p>
            <video src="${videoUrl}" controls preload="none" poster="https://via.placeholder.com/300x169.png?text=Preview+Coming+Soon"></video>
            ${settingsInfo}
            <div class="actions">
                <a href="${videoUrl}" target="_blank" download><button>Скачать</button></a>
            </div>
        `;
        return card;
    }

    function copyClipsToClipboard(clips, povType) {
        const clipsData = clips.map((clip, index) => ({
            order: index + 1,
            title: clip.title,
            clipId: clip.clipId,
            url: `https://hl.xplay.cloud/video/${clip.clipId}.mp4`,
            type: clip.type,
            settings: clip.settings,
            createdAt: clip.createdAt
        }));

        const dataToCopy = {
            povType: povType,
            totalClips: clips.length,
            clips: clipsData
        };

        const jsonString = JSON.stringify(dataToCopy, null, 2);
        
        navigator.clipboard.writeText(jsonString).then(() => {
            showNotification(`Скопировано ${clips.length} клипов (${povType}) в буфер обмена`);
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            showNotification('Ошибка при копировании данных', true);
        });
    }

    function getEventTypeText(eventType) {
        switch(eventType) {
            case 'kills': return 'Только убийства';
            case 'deaths': return 'Только смерти';
            case 'kills_deaths': return 'Убийства и смерти';
            default: return 'Неизвестно';
        }
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    function calculateKD(kills, deaths) {
        if (deaths === 0) {
            return 'NaN';
        }
        return (kills / deaths).toFixed(2);
    }

    async function renderMatches() {
        const modal = createModal("Выберите матч для записи");
        const list = modal.querySelector('#listContainer');
        const loadingText = modal.querySelector('#loadingText');
        
        try {
            const matches = await getMyMatches();
            if (!matches || matches.length === 0) {
                throw new Error("Матчи не найдены.");
            }
            
            loadingText.style.display = 'none';
            list.innerHTML = '';

            matches.forEach(match => {
                const matchItem = document.createElement('li');
                matchItem.className = 'listItem';
                matchItem.dataset.matchId = match.MatchID;

                const userTeam = match.TeamInfos.find(team => team.IsUserTeam);
                const opponentTeam = match.TeamInfos.find(team => !team.IsUserTeam);
                const userStats = match.UserStats;

                const userScoreClass = userTeam.Won ? 'team-win' : 'team-loss';
                const opponentScoreClass = opponentTeam.Won ? 'team-loss' : 'team-win';
                const kd = calculateKD(userStats.Kills, userStats.Deaths);
                
                // Правильный расчёт ADR: весь урон делим на количество раундов
                const totalRounds = userTeam.Score + opponentTeam.Score;
                const adr = totalRounds > 0 ? (userStats.Damage / totalRounds).toFixed(1) : '0.0';

                matchItem.innerHTML = `
                    <div class="listItem-header">
                        <span>${match.MapName}</span>
                        <span>${formatDate(match.MatchTime)}</span>
                    </div>
                    <div class="listItem-details">
                        <p>
                            <span class="${userScoreClass} team-score">${userTeam.Score}</span> :
                            <span class="${opponentScoreClass} team-score">${opponentTeam.Score}</span>
                            <span style="color:#b9bbbe;">(${match.LinkType})</span>
                        </p>
                        <div class="listItem-stats">
                            <div class="stat-item"><span class="stat-value player-stats">${userStats.Rating2.toFixed(2)}</span><span class="stat-label">Rating 2.0</span></div>
                            <div class="stat-item"><span class="stat-value player-stats">${kd}</span><span class="stat-label">K/D</span></div>
                            <div class="stat-item"><span class="stat-value player-stats">${userStats.Kills}</span><span class="stat-label">Kills</span></div>
                            <div class="stat-item"><span class="stat-value player-stats">${userStats.Deaths}</span><span class="stat-label">Deaths</span></div>
                            <div class="stat-item"><span class="stat-value player-stats">${adr}</span><span class="stat-label">ADR</span></div>
                        </div>
                    </div>
                `;

                matchItem.addEventListener('click', () => {
                    document.body.removeChild(modal);
                    renderPlayers(match.MatchID);
                });

                list.appendChild(matchItem);
            });
        } catch (error) {
            console.error("Ошибка при получении списка матчей:", error);
            loadingText.innerText = "Ошибка при загрузке матчей. Проверьте, авторизованы ли вы на сайте scope.gg.";
        }
    }

    async function renderPlayers(matchId) {
        const modal = createModal("Выберите игрока");
        const list = modal.querySelector('#listContainer');
        const loadingText = modal.querySelector('#loadingText');
        
        try {
            const matchData = await getMatchData(matchId);
            const players = matchData.Players;
            
            loadingText.style.display = 'none';
            list.innerHTML = '';
            
            if (players.length === 0) {
                list.innerHTML = `<li class="loading-text">Игроки не найдены.</li>`;
                return;
            }
            
            const team0Players = players.filter(p => p.TeamIndex === 0);
            const team1Players = players.filter(p => p.TeamIndex === 1);

            const team0Header = document.createElement('h3');
            team0Header.className = 'team-header';
            team0Header.innerText = 'Команда 1';
            list.appendChild(team0Header);
            team0Players.forEach(player => {
                const playerInfo = player.StaticInfo;
                const playerItem = document.createElement('li');
                playerItem.className = `listItem team-0`;
                playerItem.dataset.steamId = playerInfo.SteamID;
                playerItem.dataset.playerName = playerInfo.Name;

                playerItem.innerHTML = `
                    <div class="listItem-header">
                        <span>${playerInfo.Name}</span>
                        <span>Steam ID: ${playerInfo.SteamID}</span>
                    </div>
                `;

                playerItem.addEventListener('click', () => {
                    document.body.removeChild(modal);
                    renderOptions(matchId, playerInfo.SteamID, playerInfo.Name, matchData.Header.MatchTime, matchData.Header.MapName);
                });
                list.appendChild(playerItem);
            });
            
            const team1Header = document.createElement('h3');
            team1Header.className = 'team-header';
            team1Header.innerText = 'Команда 2';
            list.appendChild(team1Header);
            team1Players.forEach(player => {
                const playerInfo = player.StaticInfo;
                const playerItem = document.createElement('li');
                playerItem.className = `listItem team-1`;
                playerItem.dataset.steamId = playerInfo.SteamID;
                playerItem.dataset.playerName = playerInfo.Name;

                playerItem.innerHTML = `
                    <div class="listItem-header">
                        <span>${playerInfo.Name}</span>
                        <span>Steam ID: ${playerInfo.SteamID}</span>
                    </div>
                `;

                playerItem.addEventListener('click', () => {
                    document.body.removeChild(modal);
                    renderOptions(matchId, playerInfo.SteamID, playerInfo.Name, matchData.Header.MatchTime, matchData.Header.MapName);
                });
                list.appendChild(playerItem);
            });

            modal.querySelector('#closeModal').addEventListener('click', () => {
                document.body.removeChild(modal);
                showMainReportModal();
            });

        } catch (error) {
            console.error("Ошибка при получении данных об игроках:", error);
            loadingText.innerText = "Ошибка при загрузке данных об игроках.";
        }
    }

    function renderOptions(matchId, steamID, playerName, matchTime, mapName) {
        const modal = createModal(`Опции для ${playerName}`);
        const modalContent = modal.querySelector('#modalContent');
        
        let existingClips = getSavedClips().filter(c => c.matchId === matchId && c.steamID === steamID);
        let alertMessage = '';
        if (existingClips.length > 0) {
            alertMessage = `<div class="alert-message">⚠️ Для этого игрока в этом матче уже создавались компиляции. Создать дубликат?</div>`;
        }
    
        modalContent.innerHTML = `
            <span id="closeModal" class="back-button">&times;</span>
            <h2>Опции записи для ${playerName}</h2>
            ${alertMessage}
            <div class="options-container">
                <h3>События для нарезки</h3>
                <div class="checkbox-group">
                    <label><input type="checkbox" id="recordKills" checked> Убийства игрока</label>
                    <label><input type="checkbox" id="recordDeaths"> Смерти игрока</label>
                </div>
                <br>
                <h3>Точка обзора (POV)</h3>
                <div class="checkbox-group">
                    <label><input type="checkbox" id="playerPov" checked> POV игрока</label>
                    <label><input type="checkbox" id="opponentPov"> POV оппонента</label>
                </div>
                <br>
                <h3>Количество событий в группе</h3>
                <input type="number" id="eventsPerGroup" min="1" max="9" value="9" style="
                    background-color: #40444b;
                    color: white;
                    border: 1px solid #4f545c;
                    border-radius: 5px;
                    padding: 8px;
                    width: 100px;
                ">
                <br><br>
                <button id="startButton" class="start-button">Начать запись</button>
            </div>
        `;
    
        const startButton = modal.querySelector('#startButton');
        const recordKillsCheckbox = modal.querySelector('#recordKills');
        const recordDeathsCheckbox = modal.querySelector('#recordDeaths');
        const playerPovCheckbox = modal.querySelector('#playerPov');
        const opponentPovCheckbox = modal.querySelector('#opponentPov');
        const eventsPerGroupInput = modal.querySelector('#eventsPerGroup');
    
        function checkValidity() {
            const isEventSelected = recordKillsCheckbox.checked || recordDeathsCheckbox.checked;
            const isPovSelected = playerPovCheckbox.checked || opponentPovCheckbox.checked;
            startButton.disabled = !(isEventSelected && isPovSelected);
        }
    
        recordKillsCheckbox.addEventListener('change', checkValidity);
        recordDeathsCheckbox.addEventListener('change', checkValidity);
        playerPovCheckbox.addEventListener('change', checkValidity);
        opponentPovCheckbox.addEventListener('change', checkValidity);
    
        checkValidity();
    
        startButton.addEventListener('click', () => {
            const eventsPerGroup = parseInt(eventsPerGroupInput.value) || 9;
            const options = {
                recordKills: recordKillsCheckbox.checked,
                recordDeaths: recordDeathsCheckbox.checked,
                playerPov: playerPovCheckbox.checked,
                opponentPov: opponentPovCheckbox.checked,
                eventsPerGroup: eventsPerGroup
            };
    
            document.body.removeChild(modal);
            startRecording(matchId, steamID, playerName, options, matchTime, mapName);
        });
    
        modal.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
            showMainReportModal();
        });
    }

    function showConfirmationModal(message, onConfirm, onCancel) {
        const modal = createModal("Подтверждение");
        const modalContent = modal.querySelector('#modalContent');
        modalContent.innerHTML = `
            <span id="closeModal">&times;</span>
            <div class="message-text">${message}</div>
            <div class="alert-actions">
                <button id="confirmBtn" class="confirm">Да, создать дубликат</button>
                <button id="cancelBtn" class="cancel">Отмена</button>
            </div>
        `;

        modal.querySelector('#confirmBtn').addEventListener('click', () => {
            document.body.removeChild(modal);
            onConfirm();
        });
        modal.querySelector('#cancelBtn').addEventListener('click', () => {
            document.body.removeChild(modal);
            onCancel();
        });
        modal.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
            onCancel();
        });
    }

    function getSavedClips() {
        try {
            const clips = localStorage.getItem('scopegg_compilations');
            return clips ? JSON.parse(clips) : [];
        } catch (e) {
            console.error("Ошибка при загрузке данных из localStorage", e);
            return [];
        }
    }

    function saveClip(clip) {
        const clips = getSavedClips();
        clips.push(clip);
        try {
            localStorage.setItem('scopegg_compilations', JSON.stringify(clips));
        } catch (e) {
            console.error("Ошибка при сохранении данных в localStorage", e);
        }
    }

    function exportCompilationData() {
        const clips = getSavedClips();
        if (clips.length === 0) {
            showMessage("Нет данных для экспорта", true);
            return;
        }

        const exportData = {
            version: "1.0",
            exportedAt: new Date().toISOString(),
            totalClips: clips.length,
            compilations: clips
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `scopegg_compilations_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showMessage(`Экспортировано ${clips.length} компиляций`);
    }

    async function loadMatchesWithCompilations(reportContainer, modal) {
        try {
            const clips = getSavedClips();
            if (clips.length === 0) {
                reportContainer.innerHTML = `<p class="message-text">У вас пока нет созданных компиляций.</p>`;
                return;
            }

            // Получаем уникальные ID матчей из компиляций
            const matchIds = [...new Set(clips.map(clip => clip.matchId))];
            
            // Получаем данные матчей
            const matches = await getMyMatches();
            if (!matches || matches.length === 0) {
                throw new Error("Матчи не найдены.");
            }

            // Фильтруем матчи, для которых есть компиляции
            const matchesWithCompilations = matches.filter(match => matchIds.includes(match.MatchID));
            
            if (matchesWithCompilations.length === 0) {
                reportContainer.innerHTML = `<p class="message-text">Не найдено матчей с компиляциями.</p>`;
                return;
            }

            const list = document.createElement('div');
            list.className = 'main-report-list';
            
            matchesWithCompilations.forEach(match => {
                const userTeam = match.TeamInfos.find(team => team.IsUserTeam);
                const opponentTeam = match.TeamInfos.find(team => !team.IsUserTeam);
                const userStats = match.UserStats;

                const userScoreClass = userTeam.Won ? 'team-win' : 'team-loss';
                const opponentScoreClass = opponentTeam.Won ? 'team-loss' : 'team-win';
                const kd = calculateKD(userStats.Kills, userStats.Deaths);
                
                // Правильный расчёт ADR
                const totalRounds = userTeam.Score + opponentTeam.Score;
                const adr = totalRounds > 0 ? (userStats.Damage / totalRounds).toFixed(1) : '0.0';

                // Подсчитываем количество игроков с компиляциями для этого матча
                const playersWithCompilations = clips.filter(clip => clip.matchId === match.MatchID);
                const uniquePlayers = [...new Set(playersWithCompilations.map(clip => clip.playerName))];

                const matchItem = document.createElement('div');
                matchItem.className = 'listItem';
                matchItem.dataset.matchId = match.MatchID;

                matchItem.innerHTML = `
                    <div class="listItem-header">
                        <span>${match.MapName}</span>
                        <span>${formatDate(match.MatchTime)}</span>
                    </div>
                    <div class="listItem-details">
                        <p>
                            <span class="${userScoreClass} team-score">${userTeam.Score}</span> :
                            <span class="${opponentScoreClass} team-score">${opponentTeam.Score}</span>
                            <span style="color:#b9bbbe;">(${match.LinkType})</span>
                        </p>
                        <div class="listItem-stats">
                            <div class="stat-item"><span class="stat-value player-stats">${userStats.Rating2.toFixed(2)}</span><span class="stat-label">Rating 2.0</span></div>
                            <div class="stat-item"><span class="stat-value player-stats">${kd}</span><span class="stat-label">K/D</span></div>
                            <div class="stat-item"><span class="stat-value player-stats">${userStats.Kills}</span><span class="stat-label">Kills</span></div>
                            <div class="stat-item"><span class="stat-value player-stats">${userStats.Deaths}</span><span class="stat-label">Deaths</span></div>
                            <div class="stat-item"><span class="stat-value player-stats">${adr}</span><span class="stat-label">ADR</span></div>
                        </div>
                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #4f545c;">
                            <small style="color: #7289da;">Игроков с компиляциями: ${uniquePlayers.length}</small>
                        </div>
                    </div>
                `;

                matchItem.addEventListener('click', () => {
                    document.body.removeChild(modal);
                    showMatchPlayersModal(match.MatchID);
                });

                list.appendChild(matchItem);
            });
            
            reportContainer.innerHTML = '';
            reportContainer.appendChild(list);

        } catch (error) {
            console.error("Ошибка при загрузке матчей:", error);
            reportContainer.innerHTML = `<p class="message-text">Ошибка при загрузке матчей: ${error.message}</p>`;
        }
    }

    function showMatchPlayersModal(matchId) {
        const modal = createModal("Игроки с компиляциями");
        const modalContent = modal.querySelector('#modalContent');
        modalContent.innerHTML = `
            <span id="closeModal" class="back-button">&times;</span>
            <h2>Выберите игрока</h2>
            <div class="report-container" id="playersContainer"></div>
        `;

        const playersContainer = modalContent.querySelector('#playersContainer');
        const clips = getSavedClips().filter(clip => clip.matchId === matchId);
        
        if (clips.length === 0) {
            playersContainer.innerHTML = `<p class="message-text">Нет компиляций для этого матча.</p>`;
        } else {
            // Группируем по игрокам
            const groupedByPlayer = clips.reduce((acc, clip) => {
                if (!acc[clip.steamID]) {
                    acc[clip.steamID] = {
                        steamID: clip.steamID,
                        playerName: clip.playerName,
                        clips: []
                    };
                }
                acc[clip.steamID].clips.push(clip);
                return acc;
            }, {});

            const list = document.createElement('div');
            list.className = 'main-report-list';
            
            for (const steamID in groupedByPlayer) {
                const playerData = groupedByPlayer[steamID];
                const listItem = document.createElement('div');
                listItem.className = 'list-item';
                listItem.innerHTML = `
                    <p><strong>${playerData.playerName}</strong></p>
                    <small>Steam ID: ${playerData.steamID}</small>
                    <small style="color: #7289da; display: block; margin-top: 5px;">Клипов: ${playerData.clips.length}</small>
                `;
                listItem.addEventListener('click', () => {
                    document.body.removeChild(modal);
                    showDetailedReportModal(playerData);
                });
                list.appendChild(listItem);
            }
            playersContainer.appendChild(list);
        }

        modal.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
            showMainReportModal();
        });
    }

    function showMatchesViewModal() {
        const modal = createModal("Компиляции по матчам");
        const modalContent = modal.querySelector('#modalContent');
        modalContent.innerHTML = `
            <span id="closeModal">&times;</span>
            <h2>Компиляции по матчам</h2>
            <div class="report-container" id="matchesContainer"></div>
        `;

        const matchesContainer = modalContent.querySelector('#matchesContainer');
        const clips = getSavedClips();
        
        if (clips.length === 0) {
            matchesContainer.innerHTML = `<p class="message-text">У вас пока нет созданных компиляций.</p>`;
        } else {
            // Группируем по матчам
            const groupedByMatch = clips.reduce((acc, clip) => {
                const matchId = clip.matchId;
                if (!acc[matchId]) {
                    acc[matchId] = {
                        matchId: matchId,
                        matchTitle: clip.matchTitle,
                        players: {}
                    };
                }
                
                if (!acc[matchId].players[clip.steamID]) {
                    acc[matchId].players[clip.steamID] = {
                        steamID: clip.steamID,
                        playerName: clip.playerName,
                        clips: []
                    };
                }
                acc[matchId].players[clip.steamID].clips.push(clip);
                return acc;
            }, {});

            const list = document.createElement('div');
            list.className = 'main-report-list';
            
            for (const matchId in groupedByMatch) {
                const matchData = groupedByMatch[matchId];
                const totalClips = Object.values(matchData.players).reduce((sum, player) => sum + player.clips.length, 0);
                const playersCount = Object.keys(matchData.players).length;
                
                const matchItem = document.createElement('div');
                matchItem.className = 'list-item';
                matchItem.innerHTML = `
                    <p><strong>${matchData.matchTitle}</strong></p>
                    <small>Игроков: ${playersCount} | Всего клипов: ${totalClips}</small>
                    <small style="color: #7289da; display: block; margin-top: 5px;">Нажмите для просмотра</small>
                `;
                
                matchItem.addEventListener('click', () => {
                    document.body.removeChild(modal);
                    showMatchDetailsModal(matchData);
                });
                list.appendChild(matchItem);
            }
            matchesContainer.appendChild(list);
        }

        modal.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
            showMainReportModal();
        });
    }

    function showMatchDetailsModal(matchData) {
        const modal = createModal(`Компиляции: ${matchData.matchTitle}`);
        const modalContent = modal.querySelector('#modalContent');
        modalContent.innerHTML = `
            <span id="closeModal" class="back-button">&times;</span>
            <h2>${matchData.matchTitle}</h2>
            <div class="report-container" id="playersContainer"></div>
        `;
    
        const playersContainer = modalContent.querySelector('#playersContainer');
        const players = Object.values(matchData.players);
        
        players.forEach(player => {
            const playerSection = document.createElement('div');
            playerSection.className = 'match-report';
            playerSection.innerHTML = `
                <h3 style="color: #7289da; margin-top: 0;">${player.playerName} (Steam ID: ${player.steamID})</h3>
                <p>Клипов: ${player.clips.length}</p>
                <button class="delete-button" data-steamid="${player.steamID}" style="margin-bottom: 15px;">🗑️ Удалить компиляцию игрока</button>
                <div class="video-grid">
                    <div class="video-column">
                        <h4>POV игрока</h4>
                        <div class="player-pov-clips"></div>
                    </div>
                    <div class="video-column">
                        <h4>POV оппонента</h4>
                        <div class="opponent-pov-clips"></div>
                    </div>
                </div>
            `;
            
            const playerPovDiv = playerSection.querySelector('.player-pov-clips');
            const opponentPovDiv = playerSection.querySelector('.opponent-pov-clips');
            const deleteButton = playerSection.querySelector('.delete-button');
            
            const playerPovClips = player.clips.filter(c => c.type === 'playerPov');
            const opponentPovClips = player.clips.filter(c => c.type === 'opponentPov');
            const allClipIds = player.clips.map(c => c.clipId);
            
            // Обработчик удаления для отдельного игрока
            deleteButton.addEventListener('click', () => {
                if (confirm(`Удалить компиляцию игрока ${player.playerName}? (${player.clips.length} клипов)`)) {
                    const success = deleteClips(allClipIds);
                    if (success) {
                        showNotification(`Удалена компиляция игрока ${player.playerName}`);
                        // Обновляем модальное окно
                        playerSection.remove();
                        if (playersContainer.children.length === 0) {
                            playersContainer.innerHTML = `<p class="message-text">Компиляции удалены</p>`;
                        }
                    } else {
                        showNotification('Ошибка при удалении компиляции', true);
                    }
                }
            });
            
            playerPovClips.forEach(clip => {
                playerPovDiv.appendChild(createVideoCard(clip));
            });
            if (playerPovClips.length === 0) {
                playerPovDiv.innerHTML = `<p class="message-text">Нет видео</p>`;
            }
            
            opponentPovClips.forEach(clip => {
                opponentPovDiv.appendChild(createVideoCard(clip));
            });
            if (opponentPovClips.length === 0) {
                opponentPovDiv.innerHTML = `<p class="message-text">Нет видео</p>`;
            }
            
            playersContainer.appendChild(playerSection);
        });
    
        modal.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
            showMatchesViewModal();
        });
    }

    async function getMyMatches() {
        try {
            const response = await fetch("https://app.scope.gg/api/matches/getMyMatches", {
                headers: {
                    "content-type": "application/json"
                },
                body: "{\"filter\":{\"sources\":[],\"maps\":[],\"tags\":[],\"favouriteOnly\":false,\"bannedOnly\":false},\"sort\":{\"by\":\"date\",\"direction\":-1},\"offset\":0,\"limit\":15}",
                method: "POST"
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Ошибка при получении списка матчей:", error);
            return null;
        }
    }

    async function getMatchData(matchId) {
        try {
            const res = await fetch("https://app.scope.gg/api/dashboard/allstarClips/getMatchForCompilation", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    matchId: matchId
                })
            });

            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Ошибка при получении данных матча:", error);
            throw error;
        }
    }

    async function startNewCompilation() {
        await renderMatches();
    }

    async function startRecording(matchId, steamID, playerName, options, matchTime, mapName) {
        console.log(`Выбран матч ID: ${matchId}`);
        console.log(`SteamID: ${steamID}`);
        console.log(`Player Name: ${playerName}`);
        console.log(`Options:`, options);
        const progressModal = showProgressModal();
        const recorder = new MatchRecorder(matchId, steamID, playerName, options, progressModal, matchTime, mapName);
        await recorder.processAndRecord();
        progressModal.close();
        showMainReportModal();
    }

    class MatchRecorder {
        constructor(matchId, steamID, playerName, options, progressModal, matchTime, mapName) {
            this.matchId = matchId;
            this.steamID = steamID;
            this.playerName = playerName;
            this.options = options;
            this.progressModal = progressModal;
            this.matchTime = matchTime;
            this.mapName = mapName;
        }

        async recordCompilation(events, title, settings, povType) {
            try {
                const response = await fetch("https://app.scope.gg/api/dashboard/allstarClips/recordCompilation", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        matchId: this.matchId,
                        title: title,
                        events: events,
                        settings: settings
                    })
                });

                const result = await response.json();
                if (result && result.clipId) {
                    saveClip({
                        clipId: result.clipId,
                        title: title,
                        type: povType,
                        matchId: this.matchId,
                        steamID: this.steamID,
                        playerName: this.playerName,
                        matchTitle: `Матч на ${this.mapName} от ${formatDate(this.matchTime)}`,
                        settings: settings,
                        createdAt: new Date().toISOString(),
                        eventType: this.options.recordKills && this.options.recordDeaths ? 'kills_deaths' : 
                                   this.options.recordKills ? 'kills' : 'deaths'
                    });
                }
                return result;
            } catch (error) {
                console.error("Ошибка при записи компиляции:", error);
                throw error;
            }
        }

        async getMatchData() {
            try {
                const data = await getMatchData(this.matchId);
                const mapName = data.Header.MapName;
                const matchTime = formatDate(data.Header.MatchTime);
                const playersDict = {};
                data.Players.forEach(player => {
                    playersDict[player.StaticInfo.PlayerID] = player.StaticInfo;
                });

                const killEvents = data.KillEvents.map((killEvent, index) => {
                    const totalSeconds = Math.floor(killEvent.TickNumber * data.Header.TickInterval);
                    const minutes = Math.floor(totalSeconds / 60);
                    const seconds = totalSeconds % 60;
                    const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                    let killer = playersDict[killEvent.Killer];
                    if (!killer) {
                        killer = {
                            "Name": "undefiled",
                            "SteamID": "undefimed"
                        };
                    }

                    let victim = playersDict[killEvent.Victim];
                    if (!victim) {
                        victim = {
                            "Name": "undefiled",
                            "SteamID": "undefimed"
                        };
                    }

                    return {
                        round: killEvent.RoundIndexMatch + 1,
                        time: timeFormatted,
                        killer: killer.Name,
                        killerSteamID: killer.SteamID,
                        victim: victim.Name,
                        victimSteamID: victim.SteamID,
                        event: "kill",
                        element: killEvent,
                        index: index
                    };
                });

                return { killEvents, mapName, matchTime };
            } catch (error) {
                console.error("Ошибка при получении данных матча:", error);
                return { killEvents: [], mapName: null, matchTime: null };
            }
        }

        async processAndRecord() {
            try {
                const { killEvents, mapName, matchTime } = await this.getMatchData();
        
                if (!mapName || !matchTime) {
                    throw new Error("Не удалось получить данные о матче. Запись невозможна.");
                }
        
                const filteredEvents = killEvents.filter(event => {
                    const isKill = event.killerSteamID == this.steamID;
                    const isDeath = event.victimSteamID == this.steamID;
                    
                    return (this.options.recordKills && isKill) || (this.options.recordDeaths && isDeath);
                }).map(event => ({
                    index: event.index
                }));
        
                if (filteredEvents.length === 0) {
                    throw new Error("Нет подходящих событий для создания компиляции с выбранными опциями.");
                }
        
                const eventsPerGroup = this.options.eventsPerGroup || 9;
                const groupedEvents = [];
                for (let i = 0; i < filteredEvents.length; i += eventsPerGroup) {
                    groupedEvents.push(filteredEvents.slice(i, i + eventsPerGroup));
                }
        
                let eventText = '';
                if (this.options.recordKills && this.options.recordDeaths) {
                    eventText = '[Kills/Deaths]';
                } else if (this.options.recordKills) {
                    eventText = '[Kills]';
                } else if (this.options.recordDeaths) {
                    eventText = '[Deaths]';
                }
        
                let totalPovs = 0;
                if (this.options.playerPov) totalPovs++;
                if (this.options.opponentPov) totalPovs++;
                
                const totalSteps = groupedEvents.length * totalPovs;
                let currentStep = 0;
        
                for (const [groupIndex, eventGroup] of groupedEvents.entries()) {
                    const baseTitle = `[${formatDate(this.matchTime)}][${this.mapName}][${this.playerName}] ${eventText} Part ${groupIndex + 1}`;
                    
                    if (this.options.playerPov) {
                        const povTitle = `${baseTitle} [Player POV]`;
                        this.progressModal.update(currentStep, totalSteps, `Обработка группы ${groupIndex + 1}/${groupedEvents.length} (POV игрока)...`);
                        await this.recordCompilation(eventGroup, povTitle, {
                            wallHack: true,
                            voiceChat: true,
                            HUD: true,
                            aspectRatio: "16:9",
                            opponentPov: false
                        }, 'playerPov');
                        await new Promise(resolve => setTimeout(resolve, 500));
                        currentStep++;
                    }
        
                    if (this.options.opponentPov) {
                        const povTitle = `${baseTitle} [Opponent POV]`;
                        this.progressModal.update(currentStep, totalSteps, `Обработка группы ${groupIndex + 1}/${groupedEvents.length} (POV оппонента)...`);
                        await this.recordCompilation(eventGroup, povTitle, {
                            wallHack: true,
                            voiceChat: true,
                            HUD: true,
                            aspectRatio: "16:9",
                            opponentPov: true
                        }, 'opponentPov');
                        await new Promise(resolve => setTimeout(resolve, 500));
                        currentStep++;
                    }
                }
        
            } catch (error) {
                console.error("Ошибка в processAndRecord:", error);
                this.progressModal.close();
                showMessage(`Ошибка: ${error.message}`, true);
            }
        }
    }

    // Create floating button
    function createFloatingButton() {
        const button = document.createElement('button');
        button.className = 'extension-trigger';
        button.innerHTML = '📹';
        button.title = 'Scope.gg Helper';
        
        button.addEventListener('click', () => {
            showMainReportModal();
        });
        
        document.body.appendChild(button);
    }

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'showMainReport') {
            showMainReportModal();
        } else if (request.action === 'startNewCompilation') {
            startNewCompilation();
        }
    });

    // Initialize extension
    function init() {
        injectStyles();
        createFloatingButton();
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
