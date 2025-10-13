// Owner dashboard JS
const API = window.API_BASE_URL || '';

function showMessage(msg, err) {
  alert(msg + (err ? '\n' + JSON.stringify(err) : ''));
}

async function callAdmin(action, body) {
  body = body || {};
  body.action = action;
  const secret = document.getElementById('adminSecret').value;
  body.adminSecret = secret;
  const resp = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(body)
  });
  return resp.json();
}

document.getElementById('loadBtn').addEventListener('click', async () => {
  try {
    const res = await callAdmin('admin-list-menu');
    if (!res.success) return showMessage('Failed to load: ' + res.error);
    document.getElementById('ownerControls').style.display = 'block';
    renderOwnerList(res.data);
  } catch (e) { showMessage('Error', e); }
});

function renderOwnerList(items) {
  const container = document.getElementById('ownerList');
  container.innerHTML = '';
  items.forEach(it => {
    const el = document.createElement('div');
    el.style.border = '1px solid #eee';
    el.style.padding = '10px';
    el.style.marginBottom = '8px';
    el.innerHTML = `
      <strong>${it.name}</strong> <em>(${it.category})</em>
      <div>₹${it.price}</div>
      <div>${it.description || ''}</div>
      <div>Available: ${it.available ? 'yes' : 'no'}</div>
      <button data-id="${it.id}" class="toggleBtn">Toggle</button>
      <button data-id="${it.id}" class="deleteBtn">Delete</button>
    `;
    container.appendChild(el);
  });

  container.querySelectorAll('.toggleBtn').forEach(b => {
    b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const res = await callAdmin('admin-toggle-availability', { id });
      if (!res.success) return showMessage('Failed to toggle: ' + res.error);
      b.textContent = 'Toggled';
      // reload
      document.getElementById('loadBtn').click();
    });
  });

  container.querySelectorAll('.deleteBtn').forEach(b => {
    b.addEventListener('click', async (e) => {
      if (!confirm('Delete item?')) return;
      const id = e.target.dataset.id;
      const res = await callAdmin('admin-delete-item', { id });
      if (!res.success) return showMessage('Failed to delete: ' + res.error);
      showMessage('Deleted');
      document.getElementById('loadBtn').click();
    });
  });
}

document.getElementById('addItemBtn').addEventListener('click', async () => {
  const item = {
    name: document.getElementById('newName').value,
    category: document.getElementById('newCategory').value,
    price: Number(document.getElementById('newPrice').value) || 0,
    image: document.getElementById('newImage').value,
    description: document.getElementById('newDescription').value,
    available: document.getElementById('newAvailable').checked
  };
  const res = await callAdmin('admin-add-item', { item });
  if (!res.success) return showMessage('Failed: ' + res.error);
  showMessage('Added');
  document.getElementById('loadBtn').click();
});
