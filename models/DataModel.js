const fs = require('fs');
const path = require('path');

class DataModel {
    constructor(modelName) {
        this.filePath = path.join(__dirname, '../data', `${modelName}.json`);
    }

    // Helper function to read data from JSON file
    readData() {
        if (!fs.existsSync(this.filePath)) {
            return [];
        }
        const data = fs.readFileSync(this.filePath);
        const parsed = JSON.parse(data);
        // Ensure we always return an array
        if (Array.isArray(parsed)) {
            return parsed;
        } else if (parsed && typeof parsed === 'object') {
            // If it's a single object, wrap it in an array
            return [parsed];
        } else {
            // If it's something else, return empty array
            return [];
        }
    }

    // Helper function to write data to JSON file
    writeData(data) {
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    }

    // Generate a MongoDB-like ObjectID
    generateCustomId() {
        return Array.from(Array(24), () => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    // Get All Items
    getAllItems() {
        return this.readData();
    }

    // Get Item by ID
    getItemById(id) {
        const items = this.readData();
        return items.find(item => item._id === id);
    }

    // Add a New Item
    addItem(item) {
        const items = this.readData();
        const id = this.generateCustomId();
        const newItem = {
            _id: id,
            ...item,
            isActive: true,
            createdDate: new Date().toISOString()
        };
        items.push(newItem);
        this.writeData(items);
        return newItem;
    }

    // Update an Existing Item
    updateItem(id, updateData) {
        const items = this.readData();
        const index = items.findIndex(item => item._id === id);

        if (index !== -1) {
            items[index] = { ...items[index], ...updateData };
            this.writeData(items);
            return items[index];
        }
        return null;
    }

    // Delete an Item
    deleteItem(id) {
        const items = this.readData();
        const updatedItems = items.filter(item => item._id !== id);

        if (items.length !== updatedItems.length) {
            this.writeData(updatedItems);
            return true;
        }
        return false;
    }

     // Delete an Item
     deleteAll() {
            this.writeData([]);
     }

    // New Method: Get Items by Developer ID (specific to projects)
    getProjectByDeveloperId(developerId) {
        const data = this.readData();
        // Convert both to strings for comparison to handle type mismatches
        const developerIdStr = String(developerId);
        return data.filter(item => String(item.developer) === developerIdStr);
    }

     // New Method: Get Items by Project ID (specific to Cameras)
     getCameraByProjectId(projectId) {
        const data = this.readData();
        return data.filter(item => item.project === projectId);
    }

    getCameraByDeveloperId(developerId) {
        const data = this.readData();
        return data.filter(item => item.developer === developerId);
    }

    getCameraByProjectTag(projectTag) {
        const data = this.readData();
        return data.filter(item => item.projectTag === projectTag);
    }

   getRequestByDeveloperTag(tag){
        const data = this.readData();
        return data.filter(item => item.developer === tag)
    }

    getDeveloperByTag(tag) {
        const data = this.readData();
        return data.filter(item => item.developerTag === tag);
    }

    getProjectByTag(tag) {
        const data = this.readData();
        return data.filter(item => item.projectTag === tag);
    }

   
}

module.exports = DataModel;
