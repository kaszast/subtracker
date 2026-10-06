const fs = require('fs');

let i18n = fs.readFileSync('src/lib/i18n.tsx', 'utf8');

const huNew = `
    changeTheme: 'Téma módosítása',
    cardView: 'Kártya nézet',
    tableView: 'Táblázat nézet',
    edit: 'Szerkesztés',
    delete: 'Törlés',
    toggleStatus: 'Státusz váltása',
    immediateSwitch: 'Azonnali váltás',
    allCategories: 'Minden kategória',
    notEnoughData: 'Nincs elegendő adat a diagramhoz',
    noResults: 'Nincs találat a megadott feltételekre',
    colService: 'Szolgáltatás',
    colCategory: 'Kategória',
    colAmount: 'Összeg',
    colCycle: 'Ciklus',
    colPayment: 'Fizetési mód',
    colStatus: 'Státusz',
    colActions: 'Műveletek',
    errorOccurred: 'Hiba történt:',
    errorDelete: 'Hiba a törlés során:',
    error: 'Hiba:',
    errorPdf: 'Nem sikerült generálni a PDF riportot.',
    confirmRestore: 'Biztosan visszaállítod ezt az előfizetést?',
    confirmArchive: 'Biztosan archiválod ezt az előfizetést?',
    placeholderName: 'pl. Netflix',
    placeholderAmount: 'pl. 3490',
    placeholderNotes: 'pl. Családi csomag...',
    placeholderUrl: 'https://...',
  },
  en:`;

const enNew = `
    changeTheme: 'Change Theme',
    cardView: 'Card View',
    tableView: 'Table View',
    edit: 'Edit',
    delete: 'Delete',
    toggleStatus: 'Toggle Status',
    immediateSwitch: 'Immediate Switch',
    allCategories: 'All Categories',
    notEnoughData: 'Not enough data for chart',
    noResults: 'No results found for criteria',
    colService: 'Service',
    colCategory: 'Category',
    colAmount: 'Amount',
    colCycle: 'Cycle',
    colPayment: 'Payment Method',
    colStatus: 'Status',
    colActions: 'Actions',
    errorOccurred: 'An error occurred:',
    errorDelete: 'Error during deletion:',
    error: 'Error:',
    errorPdf: 'Failed to generate PDF report.',
    confirmRestore: 'Are you sure you want to restore this subscription?',
    confirmArchive: 'Are you sure you want to archive this subscription?',
    placeholderName: 'e.g. Netflix',
    placeholderAmount: 'e.g. 3490',
    placeholderNotes: 'e.g. Family plan...',
    placeholderUrl: 'https://...',
  }
};`;

i18n = i18n.replace('  },\n  en: {', huNew + ' {');
i18n = i18n.replace('  }\n};', enNew);

fs.writeFileSync('src/lib/i18n.tsx', i18n);
