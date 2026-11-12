(function () {
  const root = document.documentElement;
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  function applyTheme(isDark) {
    root.dataset.theme = isDark ? "dark" : "light";

    const themeToggle = document.querySelector("#theme-toggle");
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
    }

    if (metaThemeColor) {
      metaThemeColor.content = isDark ? "#17131d" : "#faf4ff";
    }

    localStorage.setItem("dashboard-theme", isDark ? "dark" : "light");
  }

  function initTheme() {
    const themeToggle = document.querySelector("#theme-toggle");
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem("dashboard-theme");
    if (savedTheme === "dark") {
      root.dataset.theme = "dark";
    }

    if (metaThemeColor && root.dataset.theme === "dark") {
      metaThemeColor.content = "#17131d";
    }

    themeToggle.setAttribute("aria-pressed", String(savedTheme === "dark"));
    themeToggle.setAttribute("aria-label", savedTheme === "dark" ? "Activar modo claro" : "Activar modo oscuro");
    themeToggle.addEventListener("click", () => applyTheme(root.dataset.theme !== "dark"));
  }

  function initMobileNavigation() {
    const app = document.querySelector(".app");
    const menuToggles = Array.from(document.querySelectorAll(".menu-toggle"));
    const sidebarBackdrop = document.querySelector("#sidebar-backdrop");
    const sidebar = document.querySelector("#sidebar");

    if (!app || !menuToggles.length || !sidebarBackdrop || !sidebar) return;

    const isMobile = () => window.innerWidth <= 760;
    const isMenuOpen = () => isMobile()
      ? app.classList.contains("sidebar-open")
      : !app.classList.contains("sidebar-collapsed");

    const getVisibleMenuToggle = () => menuToggles.find((toggle) => (
      window.getComputedStyle(toggle).display !== "none"
    )) || menuToggles[0];

    const updateMenuButton = () => {
      const isOpen = isMenuOpen();
      menuToggles.forEach((toggle) => {
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
      });
    };

    const closeMenu = () => {
      if (isMobile()) {
        app.classList.remove("sidebar-open");
        sidebarBackdrop.hidden = true;
        document.body.style.overflow = "";
      } else {
        app.classList.add("sidebar-collapsed");
      }
      updateMenuButton();
    };

    const openMenu = () => {
      if (isMobile()) {
        app.classList.remove("sidebar-collapsed");
        app.classList.add("sidebar-open");
        sidebarBackdrop.hidden = false;
        document.body.style.overflow = "hidden";
      } else {
        app.classList.remove("sidebar-collapsed");
      }
      updateMenuButton();
    };

    menuToggles.forEach((menuToggle) => {
      menuToggle.addEventListener("click", () => {
        if (isMenuOpen()) {
          closeMenu();
        } else {
          openMenu();
        }
      });
    });

    sidebarBackdrop.addEventListener("click", closeMenu);
    sidebar.querySelectorAll("a, .settings-link").forEach((item) => {
      item.addEventListener("click", () => {
        if (isMobile()) closeMenu();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isMenuOpen()) {
        closeMenu();
        getVisibleMenuToggle().focus();
      }
    });

    window.addEventListener("resize", () => {
      if (isMobile()) {
        app.classList.remove("sidebar-collapsed");
      } else {
        app.classList.remove("sidebar-open");
        sidebarBackdrop.hidden = true;
        document.body.style.overflow = "";
      }
      updateMenuButton();
    });

    updateMenuButton();
  }

  function resetDeleteConfirmButton() {
    const confirmDeleteButton = document.querySelector("#confirm-delete-server");
    if (!confirmDeleteButton) return;

    const deleteSpinner = confirmDeleteButton.querySelector(".save-spinner");
    const deleteButtonLabel = confirmDeleteButton.querySelector(".delete-button-label");

    confirmDeleteButton.disabled = false;
    if (deleteSpinner) deleteSpinner.hidden = true;
    if (deleteButtonLabel) deleteButtonLabel.textContent = "Sí, eliminar";
  }

  function lockPageInteractions(dialog) {
    const app = document.querySelector(".app");
    const wasAppInert = app ? app.inert : false;
    const controls = Array.from(dialog.querySelectorAll("button, input, select, textarea"));
    const disabledStates = controls.map((control) => control.disabled);
    const preventDismissal = (event) => event.preventDefault();

    if (app) app.inert = true;
    controls.forEach((control) => {
      control.disabled = true;
    });
    dialog.setAttribute("aria-busy", "true");
    dialog.addEventListener("cancel", preventDismissal);

    return () => {
      if (app) app.inert = wasAppInert;
      controls.forEach((control, index) => {
        control.disabled = disabledStates[index];
      });
      dialog.removeAttribute("aria-busy");
      dialog.removeEventListener("cancel", preventDismissal);
    };
  }

  function initDashboardSettings() {
    const settingsDialog = document.querySelector("#settings-dialog");
    const settingsForm = document.querySelector("#settings-form");
    const openSettingsButton = document.querySelector("#open-settings");
    const closeSettingsButton = document.querySelector("#close-settings");
    const cancelSettingsButton = document.querySelector("#cancel-settings");
    const saveSettingsButton = document.querySelector("#save-settings");

    if (!settingsDialog || !settingsForm || !saveSettingsButton || !openSettingsButton) return;

    const saveSettingsSpinner = saveSettingsButton.querySelector(".save-spinner");
    const saveSettingsLabel = saveSettingsButton.querySelector(".save-button-label");
    let unlockSettingsInteractions = null;

    const openSettings = () => {
      settingsForm.elements.theme.value = root.dataset.theme === "dark" ? "dark" : "light";
      saveSettingsButton.disabled = false;
      saveSettingsSpinner.hidden = true;
      saveSettingsLabel.textContent = "Guardar preferencias";
      settingsDialog.showModal();
    };

    openSettingsButton.addEventListener("click", openSettings);

    if (closeSettingsButton) {
      closeSettingsButton.addEventListener("click", () => settingsDialog.close());
    }

    if (cancelSettingsButton) {
      cancelSettingsButton.addEventListener("click", () => settingsDialog.close());
    }

    settingsDialog.addEventListener("click", (event) => {
      if (event.target === settingsDialog && !settingsDialog.hasAttribute("aria-busy")) {
        settingsDialog.close();
      }
    });

    settingsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      unlockSettingsInteractions = lockPageInteractions(settingsDialog);
      saveSettingsButton.disabled = true;
      saveSettingsSpinner.hidden = false;
      saveSettingsLabel.textContent = "Guardando...";

      const isDark = settingsForm.elements.theme.value === "dark";
      window.setTimeout(() => {
        applyTheme(isDark);
        saveSettingsSpinner.hidden = true;
        saveSettingsLabel.textContent = "Guardado correctamente";
        unlockSettingsInteractions();
        unlockSettingsInteractions = null;
        saveSettingsButton.disabled = false;
        resetDeleteConfirmButton();
      }, 900);
    });
  }

  function initServerManager() {
    const themeToggle = document.querySelector("#theme-toggle");
    const addServerDrawer = document.querySelector("#add-server-drawer");
    const deleteServerDialog = document.querySelector("#delete-server-dialog");
    const confirmDeleteButton = document.querySelector("#confirm-delete-server");
    const deleteServerTitle = document.querySelector("#delete-server-title");
    const deleteServerMessage = document.querySelector("#delete-server-message");
    const deleteSuccessMessage = document.querySelector("#delete-success-message");
    const cancelDeleteButton = document.querySelector("#cancel-delete-server");

    if (!themeToggle && !addServerDrawer && !deleteServerDialog) {
      return;
    }

    const drawerFields = {
      name: document.querySelector("#drawer-server-name"),
      ip: document.querySelector("#drawer-server-ip"),
      description: document.querySelector("#drawer-server-description"),
      environment: document.querySelector("#drawer-server-environment"),
      maintenanceDate: document.querySelector("#drawer-server-maintenance-date"),
      maintenanceAlerts: document.querySelector("#drawer-server-maintenance-alerts"),
      cpu: document.querySelector("#drawer-server-cpu"),
      ram: document.querySelector("#drawer-server-ram")
    };

    const saveServerButton = document.querySelector("#save-server");
    const saveServerSpinner = saveServerButton?.querySelector(".save-spinner");
    const saveServerLabel = saveServerButton?.querySelector(".save-server-label");
    const cancelServerButton = document.querySelector("#cancel-add-server");
    let isConfiguringServer = false;
    let serverRowToDelete = null;
    let isSavingServer = false;
    let isDeletingServer = false;
    let unlockServerInteractions = null;
    let unlockDeleteInteractions = null;

    const updateSaveServerButton = () => {
      if (!saveServerButton || isSavingServer) return;
      saveServerButton.disabled = false;
      const defaultLabel = isConfiguringServer ? "Guardar cambios" : "Añadir servidor";
      if (saveServerLabel && saveServerLabel.textContent !== defaultLabel) {
        saveServerLabel.textContent = defaultLabel;
        if (cancelServerButton) cancelServerButton.textContent = "Cancelar";
      }
    };

    Object.values(drawerFields).forEach((field) => {
      if (!field) return;
      field.addEventListener("input", updateSaveServerButton);
      field.addEventListener("change", updateSaveServerButton);
    });

    const openServerDrawer = (server) => {
      const isConfiguring = Boolean(server);
      isConfiguringServer = isConfiguring;
      document.querySelector("#maintenance-settings").hidden = !isConfiguring;
      document.querySelector("#add-server-title").textContent = isConfiguring ? "Configurar servidor" : "Añadir servidor";
      document.querySelector("#drawer-eyebrow").textContent = isConfiguring ? "CONFIGURACIÓN" : "NUEVA INSTANCIA";
      document.querySelector("#drawer-subtitle").textContent = isConfiguring ? "Consulta los parámetros de tu instancia." : "Ajusta los parámetros de tu instancia.";
      document.querySelector("#selected-server-title").textContent = isConfiguring ? server.name : "Configuración del servidor";
      document.querySelector("#selected-server-description").textContent = isConfiguring
        ? `${server.environment} · ${server.ip}`
        : "Completa estos datos para tu nueva instancia";

      Object.values(drawerFields).forEach((field) => {
        if (field) field.disabled = false;
      });

      drawerFields.name.value = server ? server.name : "";
      drawerFields.ip.value = server ? server.ip : "";
      drawerFields.description.value = server
        ? server.description || `${server.name} en entorno ${server.environment}.`
        : "";
      drawerFields.environment.value = server ? server.environment : "";
      drawerFields.maintenanceDate.value = server ? server.maintenanceDate : "";
      drawerFields.maintenanceDate.disabled = !isConfiguring;
      drawerFields.maintenanceAlerts.checked = false;
      drawerFields.maintenanceAlerts.disabled = !isConfiguring;
      drawerFields.cpu.value = server ? server.cpu : "";
      drawerFields.ram.value = server ? server.ram : "";

      if (saveServerLabel) {
        saveServerLabel.textContent = isConfiguring ? "Guardar cambios" : "Añadir servidor";
      }
      if (saveServerSpinner) saveServerSpinner.hidden = true;
      if (saveServerButton) {
        saveServerButton.disabled = false;
        delete saveServerButton.dataset.saving;
      }
      if (cancelServerButton) cancelServerButton.textContent = "Cancelar";
      if (cancelServerButton) cancelServerButton.disabled = false;
      updateSaveServerButton();
      addServerDrawer.showModal();
    };

    const bindServerActions = (row) => {
      row.querySelector(".configure-server").addEventListener("click", (event) => {
        const button = event.currentTarget;
        const cells = button.closest("tr").children;
        openServerDrawer({
          name: cells[0].querySelector(".server-name strong").textContent.trim(),
          environment: cells[0].querySelector(".server-name small").textContent.trim(),
          ip: cells[1].textContent.trim(),
          description: "",
          maintenanceDate: "",
          cpu: cells[3].querySelector(".usage").textContent.trim(),
          ram: cells[4].querySelector(".usage").textContent.trim()
        });
      });

      row.querySelector(".delete-server").addEventListener("click", () => {
        serverRowToDelete = row;
        if (!deleteServerDialog) return;

        document.querySelector("#delete-server-name").textContent = row
          .querySelector(".server-name strong").textContent.trim();
        if (deleteServerTitle) deleteServerTitle.textContent = "¿Eliminar servidor?";
        if (deleteServerMessage) deleteServerMessage.hidden = false;
        if (deleteSuccessMessage) deleteSuccessMessage.hidden = true;
        if (cancelDeleteButton) cancelDeleteButton.textContent = "Cancelar";
        resetDeleteConfirmButton();
        deleteServerDialog.showModal();
      });
    };

    document.querySelectorAll(".manage-table tbody tr").forEach(bindServerActions);

    if (addServerDrawer) {
      window.openServerDrawer = openServerDrawer;

      document.querySelector("#open-add-server")?.addEventListener("click", () => openServerDrawer(null));
      document.querySelector("#close-add-server")?.addEventListener("click", () => addServerDrawer.close());
      document.querySelector("#cancel-add-server")?.addEventListener("click", () => addServerDrawer.close());
      addServerDrawer.addEventListener("click", (event) => {
        if (event.target === addServerDrawer && !addServerDrawer.hasAttribute("aria-busy")) {
          addServerDrawer.close();
        }
      });
    }

    if (cancelDeleteButton) {
      cancelDeleteButton.addEventListener("click", () => deleteServerDialog?.close());
    }

    if (confirmDeleteButton) {
      confirmDeleteButton.addEventListener("click", () => {
        if (isDeletingServer) return;
        if (!serverRowToDelete || !deleteServerDialog) {
          deleteServerDialog?.close();
          return;
        }

        isDeletingServer = true;
        unlockDeleteInteractions = lockPageInteractions(deleteServerDialog);
        const deleteSpinner = confirmDeleteButton.querySelector(".save-spinner");
        const deleteButtonLabel = confirmDeleteButton.querySelector(".delete-button-label");

        confirmDeleteButton.disabled = true;
        if (deleteSpinner) deleteSpinner.hidden = false;
        if (deleteButtonLabel) deleteButtonLabel.textContent = "Eliminando...";

        window.setTimeout(() => {
          serverRowToDelete.remove();
          serverRowToDelete = null;

          unlockDeleteInteractions();
          unlockDeleteInteractions = null;
          isDeletingServer = false;
          if (deleteSpinner) deleteSpinner.hidden = true;
          if (deleteButtonLabel) deleteButtonLabel.textContent = "Listo";
          if (deleteServerTitle) deleteServerTitle.textContent = "Servidor eliminado";
          if (deleteServerMessage) deleteServerMessage.hidden = true;
          if (deleteSuccessMessage) deleteSuccessMessage.hidden = false;
          if (cancelDeleteButton) cancelDeleteButton.textContent = "Cerrar";
          confirmDeleteButton.disabled = false;
        }, 900);
      });
    }

    if (saveServerButton && saveServerLabel && saveServerSpinner) {
      saveServerButton.addEventListener("click", () => {
        if (saveServerButton.disabled || isSavingServer) return;

        isSavingServer = true;
        unlockServerInteractions = lockPageInteractions(addServerDrawer);
        saveServerButton.disabled = true;
        saveServerButton.dataset.saving = "true";
        saveServerSpinner.hidden = false;
        saveServerLabel.textContent = isConfiguringServer ? "Guardando..." : "Añadiendo...";
        if (cancelServerButton) cancelServerButton.disabled = true;

        window.setTimeout(() => {
          isSavingServer = false;
          unlockServerInteractions();
          unlockServerInteractions = null;
          saveServerSpinner.hidden = true;
          saveServerLabel.textContent = isConfiguringServer
            ? "Guardado correctamente"
            : "Añadido correctamente";
          saveServerButton.disabled = false;
          delete saveServerButton.dataset.saving;
          if (cancelServerButton) cancelServerButton.disabled = false;
          if (cancelServerButton) cancelServerButton.textContent = "Cerrar";
        }, 900);
      });
    }

    if (deleteServerDialog) {
      deleteServerDialog.addEventListener("click", (event) => {
        if (event.target === deleteServerDialog && !deleteServerDialog.hasAttribute("aria-busy")) {
          deleteServerDialog.close();
        }
      });
    }
  }

  initTheme();
  initMobileNavigation();
  initDashboardSettings();
  initServerManager();
})();
