// Owner dashboard JS
const API = window.API_BASE_URL || '';

function showMessage(msg, err) {
  if (err) console.error(err);
  // nicer toast-like alert
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

// Detect role by calling admin-whoami
async function whoAmI() {
  try {
    const res = await callAdmin('admin-whoami');
    return res;
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

document.getElementById('loadBtn').addEventListener('click', async () => {
  try {
    const identity = await whoAmI();
    if (!identity.success) return showMessage('Auth failed: ' + identity.error);
    const role = identity.role || 'staff';
    document.getElementById('ownerControls').style.display = 'block';
    document.getElementById('roleDisplay')?.remove();
    const hdr = document.createElement('div');
    hdr.id = 'roleDisplay';
    hdr.style.marginBottom = '10px';
    hdr.innerHTML = `<strong>Role:</strong> ${role.toUpperCase()}`;
    document.getElementById('ownerControls').prepend(hdr);

    const res = await callAdmin('admin-list-menu');
    if (!res.success) return showMessage('Failed to load: ' + res.error);
    renderOwnerList(res.data, role);
  } catch (e) { showMessage('Error', e); }
});

function renderOwnerList(items, role) {
  const container = document.getElementById('ownerList');
  container.innerHTML = '';
  items.forEach(it => {
    const el = document.createElement('div');
    el.className = 'owner-item';
    el.innerHTML = `
      <div class="owner-item-row">
        <div class="owner-item-left">
          <strong class="owner-item-name">${it.name}</strong>
          <div class="owner-item-cat">${it.category}</div>
          <div class="owner-item-desc">${it.description || ''}</div>
        </div>
        <div class="owner-item-right">
          <div class="owner-item-price">₹${it.price}</div>
          <div class="owner-item-available">Available: <span class="avail-val">${it.available ? 'yes' : 'no'}</span></div>
          <div class="owner-item-actions"></div>
        </div>
      </div>
    `;
    container.appendChild(el);

    const actions = el.querySelector('.owner-item-actions');
    // Staff: only Yes/No
    const yesBtn = document.createElement('button');
    yesBtn.className = 'btn small green';
    yesBtn.textContent = 'Yes';
    yesBtn.addEventListener('click', async () => {
      const res = await callAdmin('admin-toggle-availability', { id: it.id, available: true });
      if (!res.success) return showMessage('Failed: ' + res.error);
      showMessage('Set available: yes');
      document.getElementById('loadBtn').click();
    });
    const noBtn = document.createElement('button');
    noBtn.className = 'btn small red';
    noBtn.textContent = 'No';
    noBtn.addEventListener('click', async () => {
      // if admin we can optionally delete on No
      const deleteOnNo = (role === 'admin');
      const res = await callAdmin('admin-toggle-availability', { id: it.id, available: false, deleteOnNo: deleteOnNo });
      if (!res.success) return showMessage('Failed: ' + res.error);
      showMessage(deleteOnNo && res.deleted ? 'Deleted item' : 'Set available: no');
      document.getElementById('loadBtn').click();
    });
    actions.appendChild(yesBtn);
    actions.appendChild(noBtn);

    if (role === 'admin') {
      const delBtn = document.createElement('button');
      delBtn.className = 'btn small';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', async () => {
        if (!confirm('Delete item?')) return;
        const res = await callAdmin('admin-delete-item', { id: it.id });
        if (!res.success) return showMessage('Failed: ' + res.error);
        showMessage('Deleted');
        document.getElementById('loadBtn').click();
      });
      actions.appendChild(delBtn);
    }
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
