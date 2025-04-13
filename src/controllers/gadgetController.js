const { PrismaClient } = require('../../src/generated/prisma');
const prisma = new PrismaClient();
const {
  generateMissionSuccessProbability,
  generateCodename,
  generateConfirmationCode,
} = require('../utils/gadgetUtils');


const getAllGadgets = async (req, res, next) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }

    const gadgets = await prisma.gadget.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const gadgetsWithProbability = gadgets.map(gadget => {
      const probability = generateMissionSuccessProbability();
      return {
        ...gadget,
        missionSuccessProbability: probability,
        displayName: `${gadget.codename} - ${probability}% success probability`
      };
    });

    res.status(200).json({
      success: true,
      count: gadgetsWithProbability.length,
      data: gadgetsWithProbability,
    });
  } catch (error) {
    next(error);
  }
};


const createGadget = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Gadget name is required',
      });
    }
    let codename;
    let isUnique = false;
    
    while (!isUnique) {
      codename = generateCodename();
      const existingGadget = await prisma.gadget.findUnique({
        where: { codename },
      });
      if (!existingGadget) {
        isUnique = true;
      }
    }

    const gadget = await prisma.gadget.create({
      data: {
        name,
        codename,
        description,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Gadget created successfully',
      data: gadget,
    });
  } catch (error) {
    next(error);
  }
};


const updateGadget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    if (!name && !description && !status) {
      return res.status(400).json({
        success: false,
        message: 'At least one field to update is required',
      });
    }

    const existingGadget = await prisma.gadget.findUnique({
      where: { id },
    });

    if (!existingGadget) {
      return res.status(404).json({
        success: false,
        message: 'Gadget not found',
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (status) updateData.status = status;

    const updatedGadget = await prisma.gadget.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Gadget updated successfully',
      data: updatedGadget,
    });
  } catch (error) {
    next(error);
  }
};


const decommissionGadget = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingGadget = await prisma.gadget.findUnique({
      where: { id },
    });

    if (!existingGadget) {
      return res.status(404).json({
        success: false,
        message: 'Gadget not found',
      });
    }

    const decommissionedGadget = await prisma.gadget.update({
      where: { id },
      data: {
        status: 'DECOMMISSIONED',
        decommissionedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Gadget decommissioned successfully',
      data: decommissionedGadget,
    });
  } catch (error) {
    next(error);
  }
};


const initiateSelfDestruct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingGadget = await prisma.gadget.findUnique({
      where: { id },
    });

    if (!existingGadget) {
      return res.status(404).json({
        success: false,
        message: 'Gadget not found',
      });
    }

    const confirmationCode = generateConfirmationCode();

    await prisma.gadget.update({
      where: { id },
      data: {
        confirmationCode,
        selfDestructRequestedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Self-destruct sequence initiated',
      data: {
        gadget: existingGadget.codename,
        confirmationCode,
        instructions: 'Enter this confirmation code within 60 seconds to complete self-destruct sequence',
      },
    });
  } catch (error) {
    next(error);
  }
};


const completeSelfDestruct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { confirmationCode } = req.body;

    if (!confirmationCode) {
      return res.status(400).json({
        success: false,
        message: 'Confirmation code is required',
      });
    }

    const gadget = await prisma.gadget.findUnique({
      where: { id },
    });

    if (!gadget) {
      return res.status(404).json({
        success: false,
        message: 'Gadget not found',
      });
    }

    if (gadget.confirmationCode !== confirmationCode) {
      return res.status(401).json({
        success: false,
        message: 'Invalid confirmation code',
      });
    }

    const requestTime = new Date(gadget.selfDestructRequestedAt);
    const currentTime = new Date();
    const timeDiff = (currentTime - requestTime) / 1000;

    if (timeDiff > 60) {
      return res.status(400).json({
        success: false,
        message: 'Confirmation code has expired',
      });
    }

    const destroyedGadget = await prisma.gadget.update({
      where: { id },
      data: {
        status: 'DESTROYED',
        confirmationCode: null,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Gadget self-destruct completed successfully',
      data: destroyedGadget,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllGadgets,
  createGadget,
  updateGadget,
  decommissionGadget,
  initiateSelfDestruct,
  completeSelfDestruct,
};