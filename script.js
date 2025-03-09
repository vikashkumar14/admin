// Resource management functions
function addResource(event) {
    event.preventDefault();
    
    const title = document.getElementById('resourceTitle').value;
    const type = document.getElementById('resourceType').value;
    const file = document.getElementById('resourceFile').files[0];

    if (!title || !type || !file) {
        showNotification('Please fill in all fields', 'error');
        return false;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
        showNotification('File size should be less than 50MB', 'error');
        return false;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const resource = {
            id: Date.now(),
            title: title,
            type: type,
            fileName: file.name,
            data: e.target.result,
            uploadDate: new Date().toLocaleString()
        };

        // Get existing resources from localStorage
        let resources = JSON.parse(localStorage.getItem('resources') || '[]');
        resources.push(resource);
        localStorage.setItem('resources', JSON.stringify(resources));

        // Update display
        displayResource(resource);
        
        // Clear form
        document.getElementById('resourceForm').reset();
        
        showNotification('Resource uploaded successfully!', 'success');
    };

    reader.readAsDataURL(file);
    return false;
}

function loadResources() {
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    const resourceList = document.getElementById('resourceList');
    resourceList.innerHTML = '';
    resources.forEach(resource => displayResource(resource));
}

function displayResource(resource) {
    const resourceList = document.getElementById('resourceList');
    const resourceDiv = document.createElement('div');
    resourceDiv.className = 'resource-item';
    resourceDiv.innerHTML = `
        <div class="resource-info">
            <strong>${resource.title}</strong> (${resource.type.toUpperCase()})
            <br>
            <small>Uploaded: ${resource.uploadDate}</small>
        </div>
        <div>
            <a href="${resource.data}" class="download-btn" download="${resource.fileName}">Download</a>
            <button class="delete-btn" onclick="deleteResource(${resource.id})">Delete</button>
        </div>
    `;
    resourceList.appendChild(resourceDiv);
}

function deleteResource(resourceId) {
    if (confirm('Are you sure you want to delete this resource?')) {
        let resources = JSON.parse(localStorage.getItem('resources') || '[]');
        resources = resources.filter(r => r.id !== resourceId);
        localStorage.setItem('resources', JSON.stringify(resources));
        loadResources();
        showNotification('Resource deleted successfully!', 'success');
    }
}

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    loadChapters();
    loadResources();
});