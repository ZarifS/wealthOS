import mongoose from 'mongoose';

// Each Link is associated with a itemId and a list of Users which have that item linked to them.
const ItemLinkSchema = new mongoose.Schema({
  itemId: {
    type: String,
    index: true
  },
  users: {
    type: Array,
    default: []
  }
});

export default mongoose.model('ItemLink', ItemLinkSchema);
