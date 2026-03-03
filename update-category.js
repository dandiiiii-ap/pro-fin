const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'apps', 'portal', 'src', 'pages', 'CategoryList.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add states
const stateTarget = `    const [selectedCategory, setSelectedCategory] = useState(null);\r
    const [expandedCategories, setExpandedCategories] = useState([]);\r
    const [allExpanded, setAllExpanded] = useState(true);`;

const stateTargetFallback = stateTarget.replace(/\r/g, '');

const stateReplacement = `    const [selectedCategory, setSelectedCategory] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [allExpanded, setAllExpanded] = useState(true);

    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState("");`;

content = content.replace(stateTarget, stateReplacement).replace(stateTargetFallback, stateReplacement);

// 2. Add handlers
const handlersTarget = `    const handleDelete = (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
            const updatedCategories = categories.filter((c) => c.id !== id);
            localStorage.setItem("categories", JSON.stringify(updatedCategories));

            // Also delete related subcategories
            // Note: Check ID types carefully. Create uses Date.now() (number), select might use string.
            const updatedSubs = subCategories.filter(s => s.categoryId !== id && s.categoryId !== id.toString());
            localStorage.setItem("subCategories", JSON.stringify(updatedSubs));

            setCategories(updatedCategories);
            setSubCategories(updatedSubs);
        }
    };`;

const handlersTargetFallback = handlersTarget.replace(/\r/g, '');

const handlersReplacement = `    const handleDelete = (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
            const updatedCategories = categories.filter((c) => c.id !== id);
            localStorage.setItem("categories", JSON.stringify(updatedCategories));

            // Also delete related subcategories
            // Note: Check ID types carefully. Create uses Date.now() (number), select might use string.
            const updatedSubs = subCategories.filter(s => s.categoryId !== id && s.categoryId !== id.toString());
            localStorage.setItem("subCategories", JSON.stringify(updatedSubs));

            setCategories(updatedCategories);
            setSubCategories(updatedSubs);
        }
    };

    const handleEditCategoryClick = (cat) => {
        setEditingCategoryId(cat.id);
        setEditCategoryName(cat.name);
    };

    const handleCancelEditCategory = () => {
        setEditingCategoryId(null);
        setEditCategoryName("");
    };

    const handleSaveEditCategory = () => {
        if (!editCategoryName.trim()) return;

        // check duplicate
        const isDuplicate = categories.some(
            (c) => c.name.toLowerCase() === editCategoryName.trim().toLowerCase() && c.id !== editingCategoryId
        );
        if (isDuplicate) {
            alert("Kategori dengan nama ini sudah ada!");
            return;
        }

        const updatedCategories = categories.map(c => {
            if (c.id === editingCategoryId) {
                return { ...c, name: editCategoryName.trim() };
            }
            return c;
        });

        localStorage.setItem("categories", JSON.stringify(updatedCategories));
        setCategories(updatedCategories);
        handleCancelEditCategory();
    };`;

content = content.replace(handlersTargetFallback, handlersReplacement).replace(handlersTarget, handlersReplacement);

// 3. Add UI
const uiTarget = `                                        {/* Category Header */}
                                        <div
                                            className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            onClick={() => toggleExpand(cat.id)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={\`p-2 rounded-lg \${isExpanded ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'} transition-colors\`}>
                                                    <span className="material-icons-round">category</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                                                    <p className="text-xs text-slate-500">Includes {catSubs.length} sub-categories</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setSelectedCategory(cat); }}
                                                        className="p-1.5 text-slate-400 hover:text-primary rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                        title="Manage Subcategories"
                                                    >
                                                        <span className="material-icons-round">settings</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                        title="Delete Category"
                                                    >
                                                        <span className="material-icons-round">delete</span>
                                                    </button>
                                                </div>
                                                <span className={\`material-icons-round text-slate-400 transition-transform duration-300 \${isExpanded ? 'rotate-180' : ''}\`}>
                                                    expand_more
                                                </span>
                                            </div>
                                        </div>`;

const uiTargetFallback = uiTarget.replace(/\r/g, '');

const uiReplacement = `                                        {/* Category Header */}
                                        {editingCategoryId === cat.id ? (
                                            <div className="px-6 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 transition-colors">
                                                <div className="flex-1 mr-4">
                                                    <input
                                                        type="text"
                                                        value={editCategoryName}
                                                        onChange={(e) => setEditCategoryName(e.target.value)}
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleSaveEditCategory();
                                                            if (e.key === 'Escape') handleCancelEditCategory();
                                                        }}
                                                        className="w-full px-3 py-2 text-sm font-bold border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleCancelEditCategory(); }}
                                                        className="p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                                                        title="Batal"
                                                    >
                                                        <span className="material-icons-round text-[20px]">close</span>
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleSaveEditCategory(); }}
                                                        className="p-1.5 text-white bg-primary hover:bg-primary-hover rounded-md transition-colors"
                                                        title="Simpan"
                                                    >
                                                        <span className="material-icons-round text-[20px]">check</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                                onClick={() => toggleExpand(cat.id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={\`p-2 rounded-lg \${isExpanded ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'} transition-colors\`}>
                                                        <span className="material-icons-round">category</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                                                        <p className="text-xs text-slate-500">Includes {catSubs.length} sub-categories</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleEditCategoryClick(cat); }}
                                                            className="p-1.5 text-slate-400 hover:text-blue-500 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                            title="Edit Kategori"
                                                        >
                                                            <span className="material-icons-round">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setSelectedCategory(cat); }}
                                                            className="p-1.5 text-slate-400 hover:text-primary rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                            title="Manage Subcategories"
                                                        >
                                                            <span className="material-icons-round">settings</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}
                                                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                            title="Delete Category"
                                                        >
                                                            <span className="material-icons-round">delete</span>
                                                        </button>
                                                    </div>
                                                    <span className={\`material-icons-round text-slate-400 transition-transform duration-300 \${isExpanded ? 'rotate-180' : ''}\`}>
                                                        expand_more
                                                    </span>
                                                </div>
                                            </div>
                                        )}`;

content = content.replace(uiTargetFallback, uiReplacement).replace(uiTarget, uiReplacement);

fs.writeFileSync(filePath, content);
console.log('CategoryList.jsx updated successfully.');
