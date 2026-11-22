/*
  CONFIGURACIÓN:
  1. Pegá la URL del proyecto Supabase.
  2. Pegá la clave anon/public (NO uses service_role).
*/
const SUPABASE_URL = "https://wxcrknnuyritretcrwqw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_h2iXUhPUr277BLuio79HPw_2BOjBmg8;

const TABLE = "puestos_artesania";
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("puesto-form");
const idInput = document.getElementById("registro-id");
const nameInput = document.getElementById("nombre_punto");
const numberInput = document.getElementById("numero_puesto");
const sectorInput = document.getElementById("sector");
const categoryInput = document.getElementById("rubro");
const latInput = document.getElementById("latitud");
const lngInput = document.getElementById("longitud");
const list = document.getElementById("puestos-list");
const filter = document.getElementById("filter");
const statusBox = document.getElementById("status");
const formTitle = document.getElementById("form-title");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const map = document.getElementById("map");
const mapCaption = document.getElementById("map-caption");
const openMap = document.getElementById("open-map");
let records = [];

function message(text, isError=false) {
  statusBox.textContent = text;
  statusBox.classList.toggle("error", isError);
}
function validCoordinates(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) &&
    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
}
function showMap(record) {
  const lat = Number(record.latitud);
  const lng = Number(record.longitud);
  map.src = `https://maps.google.com/maps?q=${encodeURIComponent(lat + "," + lng)}&z=16&output=embed`;
  openMap.href = `https://www.google.com/maps?q=${encodeURIComponent(lat + "," + lng)}`;
  mapCaption.textContent = `${record.nombre_punto} · ${lat}, ${lng}`;
}
function resetForm() {
  form.reset();
  idInput.value = "";
  formTitle.textContent = "Agregar puesto";
  saveBtn.textContent = "Guardar puesto";
  cancelBtn.classList.add("hidden");
}
function render() {
  const selected = filter.value;
  const shown = selected === "todos" ? records : records.filter(r => r.rubro === selected);
  document.getElementById("count").textContent = `${shown.length} puesto(s)`;
  if (!shown.length) {
    list.innerHTML = '<tr><td colspan="3" class="empty">No hay puestos para este filtro.</td></tr>';
    return;
  }
  list.innerHTML = shown.map(r => `
    <tr>
      <td>${escapeHTML(r.numero_puesto)}</td>
      <td><span class="row-name">${escapeHTML(r.nombre_punto)}</span><span class="pill">${escapeHTML(r.rubro)}</span><br><small>${escapeHTML(r.sector)}</small></td>
      <td><div class="row-actions">
        <button class="small" type="button" data-action="map" data-id="${r.id}">Ver</button>
        <button class="edit" type="button" data-action="edit" data-id="${r.id}">Editar</button>
        <button class="danger" type="button" data-action="delete" data-id="${r.id}">Eliminar</button>
      </div></td>
    </tr>`).join("");
}
async function loadRecords() {
  message("Cargando datos...");
  const { data, error } = await client.from(TABLE).select("*").order("numero_puesto", {ascending:true});
  if (error) {
    records = [];
    render();
    message("No se pudieron cargar los datos. Revisá la clave de Supabase y la tabla. " + error.message, true);
    return;
  }
  records = data || [];
  render();
  message(`Datos cargados correctamente: ${records.length} puesto(s).`);
  if (records.length) showMap(records[0]);
}
form.addEventListener("submit", async event => {
  event.preventDefault();
  const lat = Number(latInput.value);
  const lng = Number(lngInput.value);
  if (latInput.value.trim() === "" || lngInput.value.trim() === "" || !validCoordinates(lat, lng)) {
    message("Coordenadas inválidas. Latitud: -90 a 90; longitud: -180 a 180.", true);
    return;
  }
  const payload = {
    nombre_punto: nameInput.value.trim(),
    numero_puesto: numberInput.value.trim(),
    sector: sectorInput.value.trim(),
    rubro: categoryInput.value,
    latitud: lat,
    longitud: lng
  };
  if (Object.values(payload).some(v => v === "" || v === null)) {
    message("Completá todos los campos.", true);
    return;
  }
  saveBtn.disabled = true;
  const currentId = idInput.value;
  const result = currentId
    ? await client.from(TABLE).update(payload).eq("id", currentId)
    : await client.from(TABLE).insert(payload);
  saveBtn.disabled = false;
  if (result.error) {
    message("No se pudo guardar: " + result.error.message, true);
    return;
  }
  message(currentId ? "Puesto actualizado correctamente." : "Puesto guardado correctamente.");
  resetForm();
  await loadRecords();
});
list.addEventListener("click", async event => {
  const btn = event.target.closest("button[data-action]");
  if (!btn) return;
  const record = records.find(r => String(r.id) === btn.dataset.id);
  if (!record) return;
  if (btn.dataset.action === "map") {
    showMap(record);
  } else if (btn.dataset.action === "edit") {
    idInput.value = record.id;
    nameInput.value = record.nombre_punto;
    numberInput.value = record.numero_puesto;
    sectorInput.value = record.sector;
    categoryInput.value = record.rubro;
    latInput.value = record.latitud;
    lngInput.value = record.longitud;
    formTitle.textContent = "Editar puesto";
    saveBtn.textContent = "Guardar cambios";
    cancelBtn.classList.remove("hidden");
    showMap(record);
    window.scrollTo({top:0,behavior:"smooth"});
  } else if (btn.dataset.action === "delete") {
    if (!confirm(`¿Eliminar el puesto "${record.nombre_punto}"?`)) return;
    const { error } = await client.from(TABLE).delete().eq("id", record.id);
    if (error) message("No se pudo eliminar: " + error.message, true);
    else { message("Puesto eliminado."); await loadRecords(); }
  }
});
filter.addEventListener("change", render);
cancelBtn.addEventListener("click", resetForm);
document.getElementById("reload-btn").addEventListener("click", loadRecords);

if (SUPABASE_ANON_KEY === "PEGAR_AQUI_LA_CLAVE_ANON_PUBLIC") {
  message("Falta configurar la clave anon/public de Supabase en app.js.", true);
} else {
  loadRecords();
}
