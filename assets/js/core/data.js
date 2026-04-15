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

  async function parseDataDir(files) {
    const staffFile = files.find(f => f.name === "staff.json");
    if (!staffFile) {
      throw new Error("В каталоге data отсутствует staff.json");
    }
    const staff = JSON.parse(await staffFile.text());
    if (!Array.isArray(staff)) {
      throw new Error("staff.json должен содержать массив");
    }

    const dutyPoolFile = files.find(f => f.name === "duty_pool.json");
    if (!dutyPoolFile) {
      throw new Error("В каталоге data отсутствует duty_pool.json");
    }
    const dutyPool = JSON.parse(await dutyPoolFile.text());

    const positionsPoolFile = files.find(f => f.name === "positions_pool.json");
    if (!positionsPoolFile) {
      throw new Error("В каталоге data отсутствует positionsPoolFile.json");
    }
    const positionsPool = JSON.parse(await positionsPoolFile.text());

    const rolesFile = files.find(f => f.name === "roles.json");
    if (!rolesFile) {
      throw new Error("В каталоге data отсутствует roles.json");
    }
    const roles = JSON.parse(await rolesFile.text());

    const docsFile = files.find(f => f.name === "docs.json");
    let docs = null;

    if (docsFile) {
      try {
        docs = JSON.parse(await docsFile.text());
      } catch (e) {
        throw new Error("Ошибка чтения docs.json: " + e.message);
      }
    }
    return { staff, dutyPool, roles, docs, positionsPool };
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

    async hasData() {
      const data = load();
      return !!(data && data.staff?.length && data.scenarios?.length);
    },

    async importFiles(files) {
      if (!files || !files.length) {
        throw new Error("Проверь импорт");
      }
      console.log(files)
      for (const file in files) {
        const parts = file.webkitRelativePath.split("/");
        console.log(parts)
      }
      const tests = {};
      save(tests);
    },

    async importPolls(fileList) {
      const files = getDataFiles(fileList);

      if (!files.length) {
        throw new Error("В папке data нет JSON файлов");
      }

      const polls = await readAllJson(files);

      return polls;
    },


    async getIndex() {
      const data = await load();
      return data?.index || [];
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
