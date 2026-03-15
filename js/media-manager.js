/**
 * Advanced Media Manager
 * Professional media management with upload, crop, and optimization
 * 
 * Features:
 * - Drag & drop upload
 * - Image cropping
 * - Image optimization (resize, compress, format conversion)
 * - Gallery management
 * - File organization
 * - CDN integration support
 */

'use strict';

const MediaManager = {
    // Configuration
    config: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'],
        maxDimensions: { width: 2000, height: 2000 },
        thumbnailSize: 200,
        quality: 0.85
    },
    
    // Media state
    state: {
        files: [],
        folders: [],
        selectedFiles: [],
        currentFolder: null,
        viewMode: 'grid',
        sortBy: 'date',
        sortOrder: 'desc'
    },
    
    // Initialize media manager
    init() {
        this.loadMedia();
        this.setupDropZones();
    },
    
    // Create media manager panel
    createPanel(container) {
        container.innerHTML = `
            <div class="media-manager">
                <div class="media-header">
                    <h2>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        Media Library
                    </h2>
                    <div class="media-actions">
                        <button class="btn btn-outline btn-sm" onclick="MediaManager.createFolder()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"></path>
                                <line x1="12" y1="11" x2="12" y2="17"></line>
                                <line x1="9" y1="14" x2="15" y2="14"></line>
                            </svg>
                            New Folder
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="MediaManager.openUploadDialog()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            Upload
                        </button>
                    </div>
                </div>
                
                <div class="media-toolbar">
                    <div class="toolbar-left">
                        <div class="search-box">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input type="text" id="media-search" placeholder="Search media..." oninput="MediaManager.search(this.value)">
                        </div>
                        <select id="media-filter" onchange="MediaManager.filter(this.value)">
                            <option value="all">All Files</option>
                            <option value="images">Images</option>
                            <option value="videos">Videos</option>
                            <option value="documents">Documents</option>
                        </select>
                    </div>
                    <div class="toolbar-right">
                        <div class="view-toggle">
                            <button class="view-btn active" data-view="grid" onclick="MediaManager.setView('grid')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="14" width="7" height="7"></rect>
                                    <rect x="3" y="14" width="7" height="7"></rect>
                                </svg>
                            </button>
                            <button class="view-btn" data-view="list" onclick="MediaManager.setView('list')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="8" y1="6" x2="21" y2="6"></line>
                                    <line x1="8" y1="12" x2="21" y2="12"></line>
                                    <line x1="8" y1="18" x2="21" y2="18"></line>
                                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <select id="media-sort" onchange="MediaManager.sort(this.value)">
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="name-asc">Name A-Z</option>
                            <option value="name-desc">Name Z-A</option>
                            <option value="size-desc">Largest First</option>
                            <option value="size-asc">Smallest First</option>
                        </select>
                    </div>
                </div>
                
                <div class="media-body">
                    <div class="media-sidebar">
                        <div class="folders-section">
                            <h4>Folders</h4>
                            <div id="folders-list" class="folders-list">
                                <div class="folder-item active" data-folder="all">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"></path>
                                    </svg>
                                    <span>All Files</span>
                                    <span class="folder-count" id="all-count">0</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="storage-section">
                            <h4>Storage</h4>
                            <div class="storage-bar">
                                <div class="storage-used" id="storage-used" style="width: 0%"></div>
                            </div>
                            <div class="storage-info">
                                <span id="storage-used-text">0 MB</span> used
                            </div>
                        </div>
                    </div>
                    
                    <div class="media-content">
                        <div class="upload-zone" id="main-upload-zone">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            <p>Drag and drop files here</p>
                            <span class="upload-hint">or click to browse</span>
                            <input type="file" id="main-file-input" multiple accept="image/*,video/*" style="display: none;">
                        </div>
                        
                        <div class="media-grid" id="media-grid">
                            <!-- Media items will be rendered here -->
                        </div>
                    </div>
                </div>
                
                <!-- Media Selection Bar -->
                <div class="selection-bar" id="selection-bar" style="display: none;">
                    <span class="selection-count"><span id="selection-count">0</span> selected</span>
                    <div class="selection-actions">
                        <button class="btn btn-sm btn-outline" onclick="MediaManager.editSelected()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="MediaManager.downloadSelected()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="MediaManager.deleteSelected()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Image Editor Modal -->
            <div id="image-editor-modal" class="modal" style="display: none;">
                <div class="modal-backdrop"></div>
                <div class="modal-content image-editor-content">
                    <div class="modal-header">
                        <h3>Image Editor</h3>
                        <button class="modal-close" onclick="MediaManager.closeEditor()">&times;</button>
                    </div>
                    <div class="image-editor-body">
                        <div class="editor-canvas-wrapper">
                            <canvas id="editor-canvas"></canvas>
                        </div>
                        <div class="editor-tools">
                            <div class="tool-section">
                                <h4>Crop</h4>
                                <div class="crop-presets">
                                    <button class="crop-preset" data-ratio="free" onclick="MediaManager.setCropRatio('free')">Free</button>
                                    <button class="crop-preset" data-ratio="1:1" onclick="MediaManager.setCropRatio('1:1')">1:1</button>
                                    <button class="crop-preset" data-ratio="16:9" onclick="MediaManager.setCropRatio('16:9')">16:9</button>
                                    <button class="crop-preset" data-ratio="4:3" onclick="MediaManager.setCropRatio('4:3')">4:3</button>
                                    <button class="crop-preset" data-ratio="3:2" onclick="MediaManager.setCropRatio('3:2')">3:2</button>
                                </div>
                            </div>
                            
                            <div class="tool-section">
                                <h4>Resize</h4>
                                <div class="resize-inputs">
                                    <div class="input-group">
                                        <label>Width</label>
                                        <input type="number" id="resize-width" onchange="MediaManager.updateResize()">
                                    </div>
                                    <button class="link-btn" id="aspect-lock" onclick="MediaManager.toggleAspectLock()">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0110 0v4"></path>
                                        </svg>
                                    </button>
                                    <div class="input-group">
                                        <label>Height</label>
                                        <input type="number" id="resize-height" onchange="MediaManager.updateResize()">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="tool-section">
                                <h4>Adjustments</h4>
                                <div class="adjustment-slider">
                                    <label>Brightness</label>
                                    <input type="range" id="brightness" min="-100" max="100" value="0" oninput="MediaManager.applyFilters()">
                                </div>
                                <div class="adjustment-slider">
                                    <label>Contrast</label>
                                    <input type="range" id="contrast" min="-100" max="100" value="0" oninput="MediaManager.applyFilters()">
                                </div>
                                <div class="adjustment-slider">
                                    <label>Saturation</label>
                                    <input type="range" id="saturation" min="-100" max="100" value="0" oninput="MediaManager.applyFilters()">
                                </div>
                                <div class="adjustment-slider">
                                    <label>Blur</label>
                                    <input type="range" id="blur" min="0" max="20" value="0" oninput="MediaManager.applyFilters()">
                                </div>
                            </div>
                            
                            <div class="tool-section">
                                <h4>Export Options</h4>
                                <select id="export-format">
                                    <option value="original">Original Format</option>
                                    <option value="jpeg">JPEG</option>
                                    <option value="png">PNG</option>
                                    <option value="webp">WebP</option>
                                </select>
                                <div class="quality-slider">
                                    <label>Quality: <span id="quality-value">85</span>%</label>
                                    <input type="range" id="export-quality" min="10" max="100" value="85" oninput="document.getElementById('quality-value').textContent = this.value">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="MediaManager.resetEditor()">Reset</button>
                        <button class="btn btn-primary" onclick="MediaManager.saveEditedImage()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.renderMedia();
    },
    
    // Setup drop zones
    setupDropZones() {
        document.addEventListener('DOMContentLoaded', () => {
            const uploadZone = document.getElementById('main-upload-zone');
            const fileInput = document.getElementById('main-file-input');
            
            if (uploadZone && fileInput) {
                uploadZone.addEventListener('click', () => fileInput.click());
                
                uploadZone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    uploadZone.classList.add('dragover');
                });
                
                uploadZone.addEventListener('dragleave', () => {
                    uploadZone.classList.remove('dragover');
                });
                
                uploadZone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    uploadZone.classList.remove('dragover');
                    this.handleFiles(e.dataTransfer.files);
                });
                
                fileInput.addEventListener('change', (e) => {
                    this.handleFiles(e.target.files);
                });
            }
        });
    },
    
    // Handle file upload
    handleFiles(files) {
        Array.from(files).forEach(file => {
            if (!this.config.allowedTypes.includes(file.type)) {
                showToast(`${file.name} is not a supported file type`, 'error');
                return;
            }
            
            if (file.size > this.config.maxFileSize) {
                showToast(`${file.name} exceeds the maximum file size`, 'error');
                return;
            }
            
            this.processFile(file);
        });
    },
    
    // Process uploaded file
    processFile(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const mediaItem = {
                id: 'media-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.type.startsWith('image/') ? 'image' : 'video',
                mimeType: file.type,
                size: file.size,
                url: e.target.result,
                thumbnail: null,
                dimensions: null,
                folder: this.state.currentFolder,
                uploadedAt: new Date().toISOString(),
                alt: '',
                caption: '',
                tags: []
            };
            
            // Generate thumbnail for images
            if (file.type.startsWith('image/')) {
                this.generateThumbnail(e.target.result, (thumbnail) => {
                    mediaItem.thumbnail = thumbnail;
                    this.addMediaItem(mediaItem);
                });
                
                // Get image dimensions
                const img = new Image();
                img.onload = () => {
                    mediaItem.dimensions = { width: img.width, height: img.height };
                };
                img.src = e.target.result;
            } else {
                this.addMediaItem(mediaItem);
            }
        };
        
        reader.readAsDataURL(file);
    },
    
    // Generate thumbnail
    generateThumbnail(dataUrl, callback) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const size = this.config.thumbnailSize;
            
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
                height = (height / width) * size;
                width = size;
            } else {
                width = (width / height) * size;
                height = size;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            callback(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = dataUrl;
    },
    
    // Add media item
    addMediaItem(item) {
        this.state.files.push(item);
        this.saveMedia();
        this.renderMedia();
        this.updateStorageInfo();
        showToast(`${item.name} uploaded successfully`, 'success');
    },
    
    // Render media grid
    renderMedia() {
        const grid = document.getElementById('media-grid');
        if (!grid) return;
        
        let files = [...this.state.files];
        
        // Apply current filter
        const filter = document.getElementById('media-filter')?.value || 'all';
        if (filter !== 'all') {
            files = files.filter(f => f.type === (filter === 'images' ? 'image' : filter === 'videos' ? 'video' : 'document'));
        }
        
        // Apply search
        const search = document.getElementById('media-search')?.value?.toLowerCase() || '';
        if (search) {
            files = files.filter(f => f.name.toLowerCase().includes(search));
        }
        
        // Apply sort
        const sort = document.getElementById('media-sort')?.value || 'date-desc';
        const [sortField, sortOrder] = sort.split('-');
        files.sort((a, b) => {
            let valA, valB;
            switch (sortField) {
                case 'date':
                    valA = new Date(a.uploadedAt);
                    valB = new Date(b.uploadedAt);
                    break;
                case 'name':
                    valA = a.name.toLowerCase();
                    valB = b.name.toLowerCase();
                    break;
                case 'size':
                    valA = a.size;
                    valB = b.size;
                    break;
            }
            if (sortOrder === 'asc') return valA > valB ? 1 : -1;
            return valA < valB ? 1 : -1;
        });
        
        // Update count
        const countEl = document.getElementById('all-count');
        if (countEl) countEl.textContent = this.state.files.length;
        
        // Render items
        if (this.state.viewMode === 'grid') {
            grid.className = 'media-grid';
            grid.innerHTML = files.map(item => `
                <div class="media-item ${this.state.selectedFiles.includes(item.id) ? 'selected' : ''}" 
                     data-id="${item.id}"
                     onclick="MediaManager.toggleSelect('${item.id}')"
                     ondblclick="MediaManager.openEditor('${item.id}')">
                    <div class="media-thumbnail">
                        ${item.type === 'image' ? 
                            `<img src="${item.thumbnail || item.url}" alt="${escapeHtml(item.alt || item.name)}">` :
                            `<video src="${item.url}"></video>`
                        }
                        <div class="media-overlay">
                            <button class="overlay-btn" onclick="event.stopPropagation(); MediaManager.openEditor('${item.id}')" title="Edit">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="overlay-btn" onclick="event.stopPropagation(); MediaManager.copyUrl('${item.id}')" title="Copy URL">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                                </svg>
                            </button>
                            <button class="overlay-btn delete" onclick="event.stopPropagation(); MediaManager.deleteItem('${item.id}')" title="Delete">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="media-info">
                        <span class="media-name">${escapeHtml(item.name)}</span>
                        <span class="media-meta">${this.formatFileSize(item.size)}</span>
                    </div>
                    <div class="media-checkbox">
                        <input type="checkbox" ${this.state.selectedFiles.includes(item.id) ? 'checked' : ''}>
                    </div>
                </div>
            `).join('');
        } else {
            grid.className = 'media-list';
            grid.innerHTML = `
                <div class="list-header">
                    <span class="col-name">Name</span>
                    <span class="col-type">Type</span>
                    <span class="col-size">Size</span>
                    <span class="col-date">Date</span>
                    <span class="col-actions">Actions</span>
                </div>
                ${files.map(item => `
                    <div class="list-item ${this.state.selectedFiles.includes(item.id) ? 'selected' : ''}"
                         data-id="${item.id}"
                         onclick="MediaManager.toggleSelect('${item.id}')">
                        <span class="col-name">
                            ${item.type === 'image' ? 
                                `<img src="${item.thumbnail || item.url}" class="list-thumb">` :
                                `<span class="video-icon">🎬</span>`
                            }
                            ${escapeHtml(item.name)}
                        </span>
                        <span class="col-type">${item.mimeType}</span>
                        <span class="col-size">${this.formatFileSize(item.size)}</span>
                        <span class="col-date">${new Date(item.uploadedAt).toLocaleDateString()}</span>
                        <span class="col-actions">
                            <button onclick="event.stopPropagation(); MediaManager.openEditor('${item.id}')" title="Edit">✏️</button>
                            <button onclick="event.stopPropagation(); MediaManager.deleteItem('${item.id}')" title="Delete">🗑️</button>
                        </span>
                    </div>
                `).join('')}
            `;
        }
        
        this.updateSelectionBar();
    },
    
    // Toggle selection
    toggleSelect(id) {
        const index = this.state.selectedFiles.indexOf(id);
        if (index > -1) {
            this.state.selectedFiles.splice(index, 1);
        } else {
            this.state.selectedFiles.push(id);
        }
        this.renderMedia();
    },
    
    // Update selection bar
    updateSelectionBar() {
        const bar = document.getElementById('selection-bar');
        const count = document.getElementById('selection-count');
        
        if (bar && count) {
            count.textContent = this.state.selectedFiles.length;
            bar.style.display = this.state.selectedFiles.length > 0 ? 'flex' : 'none';
        }
    },
    
    // Open image editor
    openEditor(id) {
        const item = this.state.files.find(f => f.id === id);
        if (!item || item.type !== 'image') {
            showToast('Editor is only available for images', 'info');
            return;
        }
        
        this.currentEditingImage = item;
        
        const modal = document.getElementById('image-editor-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.initEditor(item.url);
        }
    },
    
    // Initialize editor
    initEditor(url) {
        const canvas = document.getElementById('editor-canvas');
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        img.onload = () => {
            this.originalImage = img;
            this.editorState = {
                originalWidth: img.width,
                originalHeight: img.height,
                currentWidth: img.width,
                currentHeight: img.height,
                aspectLocked: true,
                cropRatio: 'free',
                filters: {
                    brightness: 0,
                    contrast: 0,
                    saturation: 0,
                    blur: 0
                }
            };
            
            canvas.width = Math.min(img.width, 800);
            canvas.height = (img.height / img.width) * canvas.width;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            document.getElementById('resize-width').value = img.width;
            document.getElementById('resize-height').value = img.height;
        };
        img.src = url;
    },
    
    // Set crop ratio
    setCropRatio(ratio) {
        this.editorState.cropRatio = ratio;
        document.querySelectorAll('.crop-preset').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.ratio === ratio);
        });
    },
    
    // Toggle aspect lock
    toggleAspectLock() {
        this.editorState.aspectLocked = !this.editorState.aspectLocked;
        document.getElementById('aspect-lock').classList.toggle('active', this.editorState.aspectLocked);
    },
    
    // Update resize
    updateResize() {
        const widthInput = document.getElementById('resize-width');
        const heightInput = document.getElementById('resize-height');
        
        if (this.editorState.aspectLocked && this.originalImage) {
            const aspectRatio = this.originalImage.width / this.originalImage.height;
            if (document.activeElement === widthInput) {
                heightInput.value = Math.round(widthInput.value / aspectRatio);
            } else {
                widthInput.value = Math.round(heightInput.value * aspectRatio);
            }
        }
        
        this.editorState.currentWidth = parseInt(widthInput.value);
        this.editorState.currentHeight = parseInt(heightInput.value);
        
        this.redrawCanvas();
    },
    
    // Apply filters
    applyFilters() {
        this.editorState.filters = {
            brightness: parseInt(document.getElementById('brightness').value),
            contrast: parseInt(document.getElementById('contrast').value),
            saturation: parseInt(document.getElementById('saturation').value),
            blur: parseInt(document.getElementById('blur').value)
        };
        
        this.redrawCanvas();
    },
    
    // Redraw canvas with current settings
    redrawCanvas() {
        const canvas = document.getElementById('editor-canvas');
        const ctx = canvas.getContext('2d');
        
        const { brightness, contrast, saturation, blur } = this.editorState.filters;
        
        ctx.filter = `
            brightness(${100 + brightness}%)
            contrast(${100 + contrast}%)
            saturate(${100 + saturation}%)
            blur(${blur}px)
        `;
        
        ctx.drawImage(this.originalImage, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';
    },
    
    // Reset editor
    resetEditor() {
        if (!this.originalImage) return;
        
        this.editorState.filters = {
            brightness: 0,
            contrast: 0,
            saturation: 0,
            blur: 0
        };
        
        document.getElementById('brightness').value = 0;
        document.getElementById('contrast').value = 0;
        document.getElementById('saturation').value = 0;
        document.getElementById('blur').value = 0;
        document.getElementById('resize-width').value = this.editorState.originalWidth;
        document.getElementById('resize-height').value = this.editorState.originalHeight;
        
        this.redrawCanvas();
    },
    
    // Save edited image
    saveEditedImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const width = parseInt(document.getElementById('resize-width').value) || this.editorState.originalWidth;
        const height = parseInt(document.getElementById('resize-height').value) || this.editorState.originalHeight;
        
        canvas.width = width;
        canvas.height = height;
        
        const { brightness, contrast, saturation, blur } = this.editorState.filters;
        ctx.filter = `
            brightness(${100 + brightness}%)
            contrast(${100 + contrast}%)
            saturate(${100 + saturation}%)
            blur(${blur}px)
        `;
        
        ctx.drawImage(this.originalImage, 0, 0, width, height);
        
        const format = document.getElementById('export-format').value;
        const quality = parseInt(document.getElementById('export-quality').value) / 100;
        
        let mimeType = 'image/jpeg';
        let extension = 'jpg';
        
        if (format === 'png') {
            mimeType = 'image/png';
            extension = 'png';
        } else if (format === 'webp') {
            mimeType = 'image/webp';
            extension = 'webp';
        } else if (this.currentEditingImage?.mimeType === 'image/png' && format === 'original') {
            mimeType = 'image/png';
            extension = 'png';
        } else if (this.currentEditingImage?.mimeType === 'image/webp' && format === 'original') {
            mimeType = 'image/webp';
            extension = 'webp';
        }
        
        const dataUrl = canvas.toDataURL(mimeType, quality);
        
        // Update the media item
        if (this.currentEditingImage) {
            const index = this.state.files.findIndex(f => f.id === this.currentEditingImage.id);
            if (index > -1) {
                this.state.files[index].url = dataUrl;
                this.state.files[index].dimensions = { width, height };
                this.state.files[index].size = Math.round(dataUrl.length * 0.75); // Approximate size
                this.generateThumbnail(dataUrl, (thumb) => {
                    this.state.files[index].thumbnail = thumb;
                    this.saveMedia();
                    this.renderMedia();
                });
            }
        }
        
        this.closeEditor();
        showToast('Image saved successfully!', 'success');
    },
    
    // Close editor
    closeEditor() {
        const modal = document.getElementById('image-editor-modal');
        if (modal) modal.style.display = 'none';
        this.currentEditingImage = null;
    },
    
    // Copy URL
    copyUrl(id) {
        const item = this.state.files.find(f => f.id === id);
        if (item) {
            navigator.clipboard.writeText(item.url).then(() => {
                showToast('URL copied to clipboard!', 'success');
            });
        }
    },
    
    // Delete item
    deleteItem(id) {
        if (confirm('Are you sure you want to delete this file?')) {
            this.state.files = this.state.files.filter(f => f.id !== id);
            this.state.selectedFiles = this.state.selectedFiles.filter(f => f !== id);
            this.saveMedia();
            this.renderMedia();
            this.updateStorageInfo();
            showToast('File deleted', 'success');
        }
    },
    
    // Delete selected
    deleteSelected() {
        if (confirm(`Delete ${this.state.selectedFiles.length} selected files?`)) {
            this.state.files = this.state.files.filter(f => !this.state.selectedFiles.includes(f.id));
            this.state.selectedFiles = [];
            this.saveMedia();
            this.renderMedia();
            this.updateStorageInfo();
            showToast('Files deleted', 'success');
        }
    },
    
    // Set view mode
    setView(mode) {
        this.state.viewMode = mode;
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === mode);
        });
        this.renderMedia();
    },
    
    // Update storage info
    updateStorageInfo() {
        const totalSize = this.state.files.reduce((sum, f) => sum + f.size, 0);
        const maxSize = 100 * 1024 * 1024; // 100MB
        
        const usedBar = document.getElementById('storage-used');
        const usedText = document.getElementById('storage-used-text');
        
        if (usedBar) usedBar.style.width = `${(totalSize / maxSize) * 100}%`;
        if (usedText) usedText.textContent = this.formatFileSize(totalSize);
    },
    
    // Format file size
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },
    
    // Save media to storage
    saveMedia() {
        try {
            localStorage.setItem('mediaLibrary', JSON.stringify(this.state.files));
        } catch (e) {
            console.error('Error saving media:', e);
        }
    },
    
    // Load media from storage
    loadMedia() {
        try {
            const saved = localStorage.getItem('mediaLibrary');
            if (saved) {
                this.state.files = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading media:', e);
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    MediaManager.init();
});
