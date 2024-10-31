/**
 * name             : tasks.js.
 * author           : vishnu.
 * created-date     : 31-Oct-2024.
 * Description      : Schema for tasks.
 */

module.exports = {
  name: 'tasks',
  schema: {
    title: {
      type: String,
      index: true,
    },
    description: {
      type: String,
      index: true,
    },
    metaInformation: {
      type: Object,
      default: {},
    },
    assignedTo: {
      type: String,
      default: 'SYSTEM',
      index: true,
    },
    status: {
      type: String,
      default: 'assigned',
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    updatedBy: {
      type: String,
      default: 'SYSTEM',
    },
    verifiedAt: Date,
    completedAt: Date,
    createdBy: {
      type: String,
      default: 'SYSTEM',
      index: true,
    },
    tasks: {
      type: Array,
      default: [],
    },
    updateHistory: {
      type: Object,
      default: {},
    },
    priority: {
      type: String,
      index: true,
    },
  },
};
