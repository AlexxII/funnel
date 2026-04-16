// работа с данными, импорт, валидация, обработка и API для получения
(function() {
  const STORAGE_KEY = "funnel.data";

  // ---------- INTERNAL HELPERS ----------

  async function load() {
    try {
      return JSON.parse(await SecureStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  }

  async function save(data) {
    await SecureStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getDataFiles(fileList) {
    return Array.from(fileList).filter(f =>
      f.webkitRelativePath.startsWith("data/") &&
      f.name.endsWith(".json")
    );
  }

  async function readAllJson(files) {
    const result = [];

    for (const file of files) {
      try {
        const text = await file.text();
        const json = JSON.parse(text);

        result.push({
          name: file.name,
          path: file.webkitRelativePath,
          data: json
        });

      } catch (e) {
        throw new Error(`Ошибка в файле ${file.webkitRelativePath}`);
      }
    }

    return result;
  }


  // ---------- PUBLIC API ----------

  const Data = {
    async init() {
      // ради совместимости.
      return;
    },

    async getTestData() {
      return ["test"];
    },

    async hasData() {
      const data = load();
      console.log(data)
      return !!(data && data.staff?.length && data.scenarios?.length);
    },

    async importPolls(fileList) {
      const files = getDataFiles(fileList);

      if (!files.length) {
        throw new Error("В папке data нет JSON файлов");
      }

      const polls = await readAllJson(files);
      console.log(polls)
      save(polls)
    },


    async getIndex() {
      const data = await load();
      return data || [];
    },

    async getStaff() {
      const data = await load();
      return data?.staff || [];
    },

    async setStaff(staff) {
      let data = await load();
      if (!data) {
        data = {
          staff: [],
          roles: {},
          scenarios: [],
          dutyPool: {},
          docs: [],
          importedAt: null
        }
      }
      data.staff = staff;
      data.importedAt = new Date().toISOString();
      await save(data);
    },

    async getDocs() {
      const data = await load();
      return data?.docs || [];
    },

    async getPositions() {
      const data = await load();
      return data?.positions || [];
    },

    async setDocs(docs) {
      let data = await load();
      if (!data) {
        data = {
          staff: [],
          roles: {},
          scenarios: [],
          dutyPool: {},
          docs: [],
          importedAt: null
        };
      }
      data.docs = docs;
      data.importedAt = new Date().toISOString();
      await save(data);
    },

    async getRoles() {
      const data = await load();
      return data?.roles || null;
    },

    async getDutyPool() {
      const data = await load();
      return data?.dutyPool || null;
    },

    async getScenarios() {
      const data = await load();
      return data?.scenarios || null;
    },

    async getScenarioById(id) {
      const data = await load();
      const scenarios = data?.scenarios || [];
      return scenarios.find(s => s.id === id) || null;
    },

    async clear() {
      await SecureStorage.removeItem(STORAGE_KEY);
    }
  };

  window.Data = Data;
})();
