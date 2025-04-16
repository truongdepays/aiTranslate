const hostname = window.location.hostname;
    const storageKey = `highlight_notes_${hostname}`;

    function loadNotes() {
        const json = localStorage.getItem(storageKey);
        return json ? JSON.parse(json) : [];
    }

    function saveNotes(notes) {
        localStorage.setItem(storageKey, JSON.stringify(notes));
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function shouldSkipNode(node) {
        const tag = node.parentNode?.nodeName;
        return ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'IFRAME'].includes(tag);
    }

    function highlightTextNodes(root, notes) {
        const words = notes.map(n => escapeRegExp(n.note));
        if (words.length === 0) return;

        // Tạo map từ note => description để dễ tra tooltip
        const descMap = Object.fromEntries(notes.map(n => [n.note.toLowerCase(), n.description]));

        const regex = new RegExp(`(${words.join('|')})`, 'gi');
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        let node;
        const nodesToReplace = [];

        while ((node = walker.nextNode())) {
            if (shouldSkipNode(node)) continue;
            if (!node.nodeValue.trim()) continue;
            if (regex.test(node.nodeValue)) {
                nodesToReplace.push(node);
            }
        }

        for (const node of nodesToReplace) {
            const parent = node.parentNode;
            const span = document.createElement('span');

            // Tách từng phần và gắn <mark> có tooltip
            const html = node.nodeValue.replace(regex, (match) => {
                const desc = descMap[match.toLowerCase()] || '';
                return `<mark class="highlighted-word" title="${desc}">${match}</mark>`;
            });

            span.innerHTML = html;
            parent.replaceChild(span, node);
        }
    }


    function createUI(notes) {
        const button = document.createElement('button');
        button.textContent = 'Note';
        button.id = 'highlight-note-btn';
        document.body.appendChild(button);

        const popup = document.createElement('div');
        popup.id = 'highlight-popup';
        popup.innerHTML = `
            <h3>Thêm Note</h3>
            <input type="text" id="note-input" placeholder="Note (từ/cụm từ)" />
            <input type="text" id="desc-input" placeholder="Description (mô tả)" />
            <button id="add-note-btn">Thêm</button>
            <table id="notes-table">
                <thead>
                    <tr><th>Note</th><th>Description</th><th>Hành động</th></tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
        document.body.appendChild(popup);

        renderTable(notes);

        GM_addStyle(`
            #highlight-note-btn {
                position: fixed;
                bottom: 200px;
                right: 10px;
                z-index: 10000;
                padding: 8px 14px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 14px;
                cursor: pointer;
            }
            #highlight-popup {
                display: none;
                position: fixed;
                bottom: 260px;
                right: 10px;
                background: white;
                border: 1px solid #ccc;
                padding: 15px;
                width: 350px;
                max-height: 70vh;
                overflow-y: auto;
                box-shadow: 0 0 8px rgba(0,0,0,0.2);
                z-index: 10001;
                border-radius: 10px;
            }
            #highlight-popup input {
                width: 100%;
                padding: 6px;
                margin: 4px 0;
                box-sizing: border-box;
            }
            #notes-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }
            #notes-table th, #notes-table td {
                border: 1px solid #ccc;
                padding: 5px;
                font-size: 13px;
                text-align: left;
            }
            .highlighted-word {
                background-color: yellow;
                font-weight: bold;
            }
            .note-action-btn {
                margin-right: 5px;
                padding: 2px 5px;
                font-size: 12px;
            }
            #add-note-btn {
               background: #e3e3e3
            }
        `);

        button.onclick = () => {
            popup.style.display = (popup.style.display === 'none') ? 'block' : 'none';
        };

        document.getElementById('add-note-btn').onclick = () => {
            const note = document.getElementById('note-input').value.trim();
            const desc = document.getElementById('desc-input').value.trim();
            if (note) {
                notes.push({ note, description: desc });
                saveNotes(notes);
                renderTable(notes); // Cập nhật bảng
                highlightTextNodes(document.body, [ { note, description: desc } ]); // Highlight tức thì
                document.getElementById('note-input').value = '';
                document.getElementById('desc-input').value = '';
            }
        };

    }

    function renderTable(notes) {
        const tbody = document.querySelector('#notes-table tbody');
        tbody.innerHTML = '';

        notes.forEach((item, index) => {
            const tr = document.createElement('tr');

            const tdNote = document.createElement('td');
            tdNote.textContent = item.note;

            const tdDesc = document.createElement('td');
            tdDesc.textContent = item.description;

            const tdActions = document.createElement('td');

            const editNoteBtn = document.createElement('button');
            editNoteBtn.textContent = 'Sửa Note';
            editNoteBtn.className = 'note-action-btn';
            editNoteBtn.onclick = () => {
                const newNote = prompt("Sửa note:", item.note);
                if (newNote !== null && newNote.trim() !== '') {
                    notes[index].note = newNote.trim();
                    saveNotes(notes);
                    location.reload();
                }
            };

            const editDescBtn = document.createElement('button');
            editDescBtn.textContent = 'Sửa Desc';
            editDescBtn.className = 'note-action-btn';
            editDescBtn.onclick = () => {
                const newDesc = prompt("Sửa mô tả:", item.description);
                if (newDesc !== null) {
                    notes[index].description = newDesc.trim();
                    saveNotes(notes);
                    location.reload();
                }
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Xóa';
            deleteBtn.className = 'note-action-btn';
            deleteBtn.onclick = () => {
                if (confirm("Bạn có chắc muốn xóa?")) {
                    notes.splice(index, 1);
                    saveNotes(notes);
                    location.reload();
                }
            };

            tdActions.appendChild(editNoteBtn);
            tdActions.appendChild(editDescBtn);
            tdActions.appendChild(deleteBtn);

            tr.appendChild(tdNote);
            tr.appendChild(tdDesc);
            tr.appendChild(tdActions);
            tbody.appendChild(tr);
        });
    }

    window.addEventListener('load', () => {
        const notes = loadNotes();
        highlightTextNodes(document.body, notes);
        createUI(notes);
    });
