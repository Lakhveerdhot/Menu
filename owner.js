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

// helper: get/set secret from sessionStorage
function setSecret(s) { try { if (document.getElementById('rememberSecret').checked) sessionStorage.setItem('ownerSecret', s); else sessionStorage.setItem('ownerSecret', s); } catch(e){} }
function getSecret() { try { return sessionStorage.getItem('ownerSecret') || document.getElementById('adminSecret').value; } catch(e){ return document.getElementById('adminSecret').value; } }

// auto-login if secret present
window.addEventListener('load', () => {
  const s = getSecret();
  if (s) {
    document.getElementById('adminSecret').value = s;
    document.getElementById('rememberSecret').checked = true;
    document.getElementById('loadBtn').click();
  }
});

// allow Enter to login
document.getElementById('adminSecret').addEventListener('keydown', (e) => { if (e.key === 'Enter') document.getElementById('loadBtn').click(); });

// show/hide secret
document.getElementById('showSecret').addEventListener('change', (e) => { document.getElementById('adminSecret').type = e.target.checked ? 'text' : 'password'; });

// main login handler
document.getElementById('loadBtn').addEventListener('click', async () => {
  try {
  const secretVal = document.getElementById('adminSecret').value;
  setSecret(secretVal);
  const identity = await whoAmI();
    if (!identity.success) return showMessage('Auth failed: ' + identity.error);
    const role = identity.role || 'staff';
    document.getElementById('ownerControls').style.display = 'block';
    document.getElementById('addItemControls').style.display = 'block';
    document.getElementById('menuManagementBtn').style.display = 'block';
    document.getElementById('roleDisplay')?.remove();
    const hdr = document.createElement('div');
    hdr.id = 'roleDisplay';
    hdr.style.marginBottom = '10px';
    hdr.innerHTML = `<strong>Role:</strong> ${role.toUpperCase()}`;
    document.getElementById('ownerControls').prepend(hdr);

    // fetch menu and orders in parallel for speed
    const [menuRes, ord] = await Promise.all([callAdmin('admin-list-menu'), callAdmin('admin-today-orders')]);
    if (!menuRes.success) return showMessage('Failed to load menu: ' + menuRes.error);
    document.getElementById('ownerControls').style.display = 'block';
    renderOwnerList(menuRes.data, role);
    if (ord.success) {
      renderOrders(ord.data);
      document.getElementById('stat-orders-today').textContent = ord.count || ord.data.length || 0;
      const revenue = ord.data.reduce((s,o)=>s+(o.total||0),0);
      document.getElementById('stat-revenue').textContent = '₹' + revenue.toFixed(2);
      document.getElementById('stat-clients').textContent = ord.count || ord.data.length || 0;
    }

    // poll for new orders every 10 seconds
    if (window._orderPoll) clearInterval(window._orderPoll);
    window._orderPoll = setInterval(async () => {
      try {
        const upd = await callAdmin('admin-today-orders');
        if (upd.success) {
          // naive update: re-render orders if count changed
          const oldCount = document.querySelectorAll('#ordersTable tbody tr').length;
          if ((upd.count || upd.data.length) !== oldCount) {
            renderOrders(upd.data);
          }
        }
      } catch (e) { console.warn('poll error', e); }
    }, 10000);
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

function renderOrders(orders) {
  const tbody = document.querySelector('#ordersTable tbody');
  tbody.innerHTML = '';
  orders.forEach((o, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx+1}</td>
      <td>${o.orderId}</td>
      <td>${o.timestamp}</td>
      <td>${o.customer} (${o.mobile})</td>
      <td>${o.items.map(it=>`${it.name} x${it.quantity}`).join('<br>')}</td>
      <td>₹${(o.total||0).toFixed(2)}</td>
      <td><button class="btn small" data-id="${o.orderId}">View</button></td>
    `;
    tbody.appendChild(tr);
  });
  // update menus stat count too
  // simple count of menu items
  const menusCountEl = document.getElementById('stat-menus');
  const list = document.getElementById('ownerList');
  menusCountEl.textContent = list.children.length || '--';
}

// Menu Management Modal handlers
document.getElementById('menuManagementBtn').addEventListener('click', () => {
  document.getElementById('menuManagementModal').style.display = 'flex';
});

document.getElementById('closeMenuModal').addEventListener('click', () => {
  document.getElementById('menuManagementModal').style.display = 'none';
});

// Close modal when clicking outside
document.getElementById('menuManagementModal').addEventListener('click', (e) => {
  if (e.target.id === 'menuManagementModal') {
    document.getElementById('menuManagementModal').style.display = 'none';
  }
});
