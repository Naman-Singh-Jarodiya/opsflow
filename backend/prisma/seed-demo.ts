import bcrypt from "bcrypt";
import { PrismaClient, UserRole, WorkItemStatus, WorkItemPriority, ActivityType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Resetting OpsFlow demo data...");

  await prisma.idempotencyKey.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.workItem.deleteMany();
  await prisma.teamMembership.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Admin@123", 12);
  const memberPasswordHash = await bcrypt.hash("User@123", 12);

  console.log("👥 Creating users...");

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alex Morgan",
        email: "admin@opsflow.local",
        passwordHash,
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        name: "Sarah Wilson",
        email: "sarah@opsflow.local",
        passwordHash: memberPasswordHash,
        role: UserRole.MANAGER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Daniel Carter",
        email: "daniel@opsflow.local",
        passwordHash: memberPasswordHash,
        role: UserRole.MANAGER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Emily Johnson",
        email: "emily@opsflow.local",
        passwordHash: memberPasswordHash,
        role: UserRole.MEMBER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Michael Brown",
        email: "michael@opsflow.local",
        passwordHash: memberPasswordHash,
        role: UserRole.MEMBER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Olivia Davis",
        email: "olivia@opsflow.local",
        passwordHash: memberPasswordHash,
        role: UserRole.MEMBER,
      },
    }),
    prisma.user.create({
      data: {
        name: "James Miller",
        email: "james@opsflow.local",
        passwordHash: memberPasswordHash,
        role: UserRole.MEMBER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Sophia Anderson",
        email: "sophia@opsflow.local",
        passwordHash: memberPasswordHash,
        role: UserRole.MEMBER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Ethan Thomas",
        email: "ethan@opsflow.local",
        passwordHash: memberPasswordHash,
        role: UserRole.MEMBER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Isabella Taylor",
        email: "isabella@opsflow.local",
        passwordHash: memberPasswordHash,
        role: UserRole.MEMBER,
      },
    }),
  ]);

  const [
    admin,
    sarah,
    daniel,
    emily,
    michael,
    olivia,
    james,
    sophia,
    ethan,
    isabella,
  ] = users;

  console.log("🏢 Creating teams...");

  const operations = await prisma.team.create({
    data: {
      name: "Operations",
      description: "Daily operational workflows, escalations and internal processes.",
    },
  });

  const finance = await prisma.team.create({
    data: {
      name: "Finance",
      description: "Payments, invoices, reconciliation and financial operations.",
    },
  });

  const support = await prisma.team.create({
    data: {
      name: "Customer Support",
      description: "Customer escalations, service issues and support operations.",
    },
  });

  const engineering = await prisma.team.create({
    data: {
      name: "Engineering",
      description: "Product bugs, incidents, infrastructure and engineering tasks.",
    },
  });

  console.log("🔗 Creating team memberships...");

  const memberships = [
    [admin.id, operations.id],
    [admin.id, finance.id],
    [admin.id, support.id],
    [admin.id, engineering.id],

    [sarah.id, operations.id],
    [sarah.id, finance.id],

    [daniel.id, support.id],
    [daniel.id, engineering.id],

    [emily.id, operations.id],
    [emily.id, support.id],

    [michael.id, operations.id],
    [michael.id, finance.id],

    [olivia.id, finance.id],
    [olivia.id, support.id],

    [james.id, engineering.id],
    [james.id, operations.id],

    [sophia.id, support.id],
    [sophia.id, engineering.id],

    [ethan.id, engineering.id],
    [ethan.id, finance.id],

    [isabella.id, operations.id],
    [isabella.id, support.id],
  ];

  await prisma.teamMembership.createMany({
    data: memberships.map(([userId, teamId]) => ({
      userId,
      teamId,
    })),
  });

  console.log("📋 Creating work items...");

  const teamUsers = {
    operations: [sarah, emily, michael, james, isabella],
    finance: [sarah, michael, olivia, ethan],
    support: [daniel, emily, olivia, sophia, isabella],
    engineering: [daniel, james, sophia, ethan],
  };

  const workItems = [
    {
      title: "Resolve delayed payment reconciliation",
      description: "Investigate delayed payment records and reconcile the affected transactions.",
      status: WorkItemStatus.RESOLVED,
      priority: WorkItemPriority.URGENT,
      teamId: finance.id,
      assigneeId: olivia.id,
      dueDays: -2,
    },
    {
      title: "Review pending operational escalations",
      description: "Review all unresolved operational escalations and identify blockers.",
      status: WorkItemStatus.IN_PROGRESS,
      priority: WorkItemPriority.HIGH,
      teamId: operations.id,
      assigneeId: emily.id,
      dueDays: 1,
    },
    {
      title: "Update weekly operations report",
      description: "Prepare the weekly operational performance report for management.",
      status: WorkItemStatus.OPEN,
      priority: WorkItemPriority.MEDIUM,
      teamId: operations.id,
      assigneeId: sarah.id,
      dueDays: 4,
    },
    {
      title: "Investigate invoice mismatch",
      description: "Investigate mismatched invoice totals reported by the finance team.",
      status: WorkItemStatus.BLOCKED,
      priority: WorkItemPriority.HIGH,
      teamId: finance.id,
      assigneeId: michael.id,
      dueDays: 2,
    },
    {
      title: "Prepare month-end finance checklist",
      description: "Complete the checklist required for the month-end financial close.",
      status: WorkItemStatus.OPEN,
      priority: WorkItemPriority.MEDIUM,
      teamId: finance.id,
      assigneeId: ethan.id,
      dueDays: 7,
    },
    {
      title: "Customer escalation: account access",
      description: "Resolve a high-priority customer account access escalation.",
      status: WorkItemStatus.IN_PROGRESS,
      priority: WorkItemPriority.URGENT,
      teamId: support.id,
      assigneeId: sophia.id,
      dueDays: 0,
    },
    {
      title: "Investigate recurring customer complaints",
      description: "Analyze recent customer complaints and identify recurring issues.",
      status: WorkItemStatus.OPEN,
      priority: WorkItemPriority.HIGH,
      teamId: support.id,
      assigneeId: daniel.id,
      dueDays: 3,
    },
    {
      title: "Improve support response workflow",
      description: "Review the support response process and propose improvements.",
      status: WorkItemStatus.RESOLVED,
      priority: WorkItemPriority.MEDIUM,
      teamId: support.id,
      assigneeId: emily.id,
      dueDays: -5,
    },
    {
      title: "Production API latency investigation",
      description: "Investigate elevated API response times reported in production.",
      status: WorkItemStatus.IN_PROGRESS,
      priority: WorkItemPriority.URGENT,
      teamId: engineering.id,
      assigneeId: ethan.id,
      dueDays: 1,
    },
    {
      title: "Fix notification delivery issue",
      description: "Investigate intermittent notification delivery failures.",
      status: WorkItemStatus.BLOCKED,
      priority: WorkItemPriority.HIGH,
      teamId: engineering.id,
      assigneeId: james.id,
      dueDays: 2,
    },
    {
      title: "Upgrade application dependencies",
      description: "Review and upgrade outdated application dependencies.",
      status: WorkItemStatus.OPEN,
      priority: WorkItemPriority.LOW,
      teamId: engineering.id,
      assigneeId: sophia.id,
      dueDays: 14,
    },
    {
      title: "Database performance review",
      description: "Review slow database queries and identify optimization opportunities.",
      status: WorkItemStatus.RESOLVED,
      priority: WorkItemPriority.HIGH,
      teamId: engineering.id,
      assigneeId: daniel.id,
      dueDays: -4,
    },
    {
      title: "Audit user access permissions",
      description: "Review access permissions across operational teams.",
      status: WorkItemStatus.OPEN,
      priority: WorkItemPriority.HIGH,
      teamId: operations.id,
      assigneeId: isabella.id,
      dueDays: 5,
    },
    {
      title: "Document emergency escalation process",
      description: "Create documentation for handling emergency operational escalations.",
      status: WorkItemStatus.CLOSED,
      priority: WorkItemPriority.MEDIUM,
      teamId: operations.id,
      assigneeId: james.id,
      dueDays: -10,
    },
    {
      title: "Review suspicious payment activity",
      description: "Review flagged payment activity and document the findings.",
      status: WorkItemStatus.IN_PROGRESS,
      priority: WorkItemPriority.URGENT,
      teamId: finance.id,
      assigneeId: sarah.id,
      dueDays: 0,
    },
    {
      title: "Vendor payment follow-up",
      description: "Follow up with vendors regarding outstanding payment confirmations.",
      status: WorkItemStatus.OPEN,
      priority: WorkItemPriority.LOW,
      teamId: finance.id,
      assigneeId: michael.id,
      dueDays: 10,
    },
    {
      title: "Customer refund verification",
      description: "Verify refund requests before processing.",
      status: WorkItemStatus.CLOSED,
      priority: WorkItemPriority.MEDIUM,
      teamId: finance.id,
      assigneeId: olivia.id,
      dueDays: -12,
    },
    {
      title: "Support queue backlog cleanup",
      description: "Reduce the current support queue backlog and close outdated requests.",
      status: WorkItemStatus.IN_PROGRESS,
      priority: WorkItemPriority.HIGH,
      teamId: support.id,
      assigneeId: isabella.id,
      dueDays: 2,
    },
    {
      title: "Update customer escalation templates",
      description: "Update response templates used for customer escalations.",
      status: WorkItemStatus.OPEN,
      priority: WorkItemPriority.LOW,
      teamId: support.id,
      assigneeId: sophia.id,
      dueDays: 8,
    },
    {
      title: "Investigate failed webhook events",
      description: "Identify the reason behind failed webhook deliveries.",
      status: WorkItemStatus.BLOCKED,
      priority: WorkItemPriority.HIGH,
      teamId: engineering.id,
      assigneeId: ethan.id,
      dueDays: 3,
    },
    {
      title: "Add monitoring for background jobs",
      description: "Add monitoring coverage for critical background processing jobs.",
      status: WorkItemStatus.OPEN,
      priority: WorkItemPriority.MEDIUM,
      teamId: engineering.id,
      assigneeId: james.id,
      dueDays: 12,
    },
    {
      title: "Review deployment checklist",
      description: "Review the deployment checklist before the next release.",
      status: WorkItemStatus.RESOLVED,
      priority: WorkItemPriority.MEDIUM,
      teamId: engineering.id,
      assigneeId: daniel.id,
      dueDays: -3,
    },
    {
      title: "Operations capacity planning",
      description: "Estimate operational capacity requirements for the next quarter.",
      status: WorkItemStatus.OPEN,
      priority: WorkItemPriority.HIGH,
      teamId: operations.id,
      assigneeId: sarah.id,
      dueDays: 15,
    },
    {
      title: "Review internal process documentation",
      description: "Identify outdated process documentation and update it.",
      status: WorkItemStatus.IN_PROGRESS,
      priority: WorkItemPriority.LOW,
      teamId: operations.id,
      assigneeId: michael.id,
      dueDays: 6,
    },
    {
      title: "Payment reconciliation automation",
      description: "Evaluate opportunities to automate repetitive payment reconciliation work.",
      status: WorkItemStatus.OPEN,
      priority: WorkItemPriority.HIGH,
      teamId: finance.id,
      assigneeId: ethan.id,
      dueDays: 20,
    },
    {
      title: "Customer satisfaction review",
      description: "Review recent customer satisfaction metrics and action items.",
      status: WorkItemStatus.RESOLVED,
      priority: WorkItemPriority.MEDIUM,
      teamId: support.id,
      assigneeId: olivia.id,
      dueDays: -7,
    },
    {
      title: "Incident response documentation",
      description: "Document the response process used during production incidents.",
      status: WorkItemStatus.OPEN,
      priority: WorkItemPriority.HIGH,
      teamId: engineering.id,
      assigneeId: sophia.id,
      dueDays: 9,
    },
    {
      title: "Quarterly access review",
      description: "Review user access and remove unnecessary permissions.",
      status: WorkItemStatus.CLOSED,
      priority: WorkItemPriority.URGENT,
      teamId: operations.id,
      assigneeId: isabella.id,
      dueDays: -20,
    },
    {
      title: "Finance dashboard validation",
      description: "Validate dashboard numbers against the source finance records.",
      status: WorkItemStatus.IN_PROGRESS,
      priority: WorkItemPriority.HIGH,
      teamId: finance.id,
      assigneeId: sarah.id,
      dueDays: 4,
    },
    {
      title: "Support SLA breach investigation",
      description: "Investigate tickets that exceeded the defined support SLA.",
      status: WorkItemStatus.BLOCKED,
      priority: WorkItemPriority.URGENT,
      teamId: support.id,
      assigneeId: daniel.id,
      dueDays: 1,
    },
    {
      title: "API error-rate monitoring",
      description: "Review API error-rate trends and identify unstable endpoints.",
      status: WorkItemStatus.OPEN,
      priority: WorkItemPriority.MEDIUM,
      teamId: engineering.id,
      assigneeId: ethan.id,
      dueDays: 5,
    },
    {
      title: "Internal operations training",
      description: "Prepare training material for new operations team members.",
      status: WorkItemStatus.OPEN,
      priority: WorkItemPriority.LOW,
      teamId: operations.id,
      assigneeId: emily.id,
      dueDays: 18,
    },
    {
      title: "Monthly vendor reconciliation",
      description: "Reconcile vendor records and identify outstanding discrepancies.",
      status: WorkItemStatus.RESOLVED,
      priority: WorkItemPriority.HIGH,
      teamId: finance.id,
      assigneeId: michael.id,
      dueDays: -2,
    },
    {
      title: "Customer escalation audit",
      description: "Audit recent escalations for response quality and resolution time.",
      status: WorkItemStatus.OPEN,
      priority: WorkItemPriority.MEDIUM,
      teamId: support.id,
      assigneeId: sophia.id,
      dueDays: 11,
    },
    {
      title: "Release readiness review",
      description: "Review outstanding release tasks and verify production readiness.",
      status: WorkItemStatus.IN_PROGRESS,
      priority: WorkItemPriority.HIGH,
      teamId: engineering.id,
      assigneeId: james.id,
      dueDays: 2,
    },
    {
      title: "Old operational request",
      description: "Demo item used to test soft deletion behavior.",
      status: WorkItemStatus.CLOSED,
      priority: WorkItemPriority.LOW,
      teamId: operations.id,
      assigneeId: michael.id,
      dueDays: -30,
      deleted: true,
    },
  ];

  const createdItems = [];

  for (let i = 0; i < workItems.length; i++) {
    const item = workItems[i];

    const created = await prisma.workItem.create({
      data: {
        title: item.title,
        description: item.description,
        status: item.status,
        priority: item.priority,
        teamId: item.teamId,
        assigneeId: item.assigneeId,
        createdById: admin.id,
        assignedById: admin.id,
        dueDate: new Date(Date.now() + item.dueDays * 24 * 60 * 60 * 1000),
        version:
          item.status === WorkItemStatus.OPEN
            ? 1
            : item.status === WorkItemStatus.IN_PROGRESS
              ? 2
              : item.status === WorkItemStatus.BLOCKED
                ? 3
                : item.status === WorkItemStatus.RESOLVED
                  ? 4
                  : 5,
        deletedAt: item.deleted ? new Date() : null,
        deletedById: item.deleted ? admin.id : null,
      },
    });

    createdItems.push(created);

    await prisma.activity.create({
      data: {
        type: ActivityType.CREATED,
        message: `Work item "${created.title}" was created`,
        workItemId: created.id,
        userId: admin.id,
        metadata: {
          priority: created.priority,
          teamId: created.teamId,
        },
      },
    });

    if (created.assigneeId) {
      await prisma.activity.create({
        data: {
          type: ActivityType.ASSIGNED,
          message: `Work item "${created.title}" was assigned`,
          workItemId: created.id,
          userId: admin.id,
          metadata: {
            assigneeId: created.assigneeId,
          },
        },
      });
    }

    if (created.status !== WorkItemStatus.OPEN) {
      await prisma.activity.create({
        data: {
          type: ActivityType.STATUS_CHANGED,
          message: `Work item "${created.title}" changed to ${created.status}`,
          workItemId: created.id,
          userId: created.assigneeId ?? admin.id,
          metadata: {
            newStatus: created.status,
          },
        },
      });
    }

    if (created.priority === WorkItemPriority.HIGH || created.priority === WorkItemPriority.URGENT) {
      await prisma.activity.create({
        data: {
          type: ActivityType.PRIORITY_CHANGED,
          message: `Priority set to ${created.priority}`,
          workItemId: created.id,
          userId: admin.id,
          metadata: {
            priority: created.priority,
          },
        },
      });
    }
  }

  console.log("💬 Creating comments...");

  const commentItems = createdItems.filter((item) => !item.deletedAt).slice(0, 12);

  for (let i = 0; i < commentItems.length; i++) {
    const item = commentItems[i];

    const authors = [admin, sarah, daniel, emily, michael, olivia, james, sophia];
    const author = authors[i % authors.length];

    await prisma.comment.create({
      data: {
        content: [
          "I have started investigating this.",
          "This needs a quick review before closing.",
          "I found the main issue and am working on the fix.",
          "Waiting for confirmation from the relevant team.",
          "This has been reviewed and the next step is clear.",
          "I will follow up on this today.",
          "The current approach looks good from my side.",
          "Adding this to the next operational review.",
          "The issue appears to be related to an upstream dependency.",
          "I have attached the findings to the work item.",
          "This is ready for final verification.",
          "Please review the latest update.",
        ][i],
        workItemId: item.id,
        authorId: author.id,
      },
    });

    await prisma.activity.create({
      data: {
        type: ActivityType.COMMENT_ADDED,
        message: `Comment added to "${item.title}"`,
        workItemId: item.id,
        userId: author.id,
      },
    });
  }

  console.log("🗑️ Adding soft-delete activity...");

  const deletedItem = createdItems.find((item) => item.deletedAt);

  if (deletedItem) {
    await prisma.activity.create({
      data: {
        type: ActivityType.DELETED,
        message: `Work item "${deletedItem.title}" was deleted`,
        workItemId: deletedItem.id,
        userId: admin.id,
        metadata: {
          reason: "Demo soft-delete record",
        },
      },
    });
  }

  console.log("");
  console.log("✅ OpsFlow demo data created successfully!");
  console.log("");
  console.log("📊 Dataset:");
  console.log(`Users: ${users.length}`);
  console.log("Teams: 4");
  console.log(`Work items: ${createdItems.length}`);
  console.log(`Active work items: ${createdItems.filter((x) => !x.deletedAt).length}`);
  console.log("Soft-deleted work items: 1");
  console.log("");
  console.log("🔐 Login accounts:");
  console.log("Admin:   admin@opsflow.local / Admin@123");
  console.log("Manager: sarah@opsflow.local / User@123");
  console.log("Manager: daniel@opsflow.local / User@123");
  console.log("Member:  emily@opsflow.local / User@123");
  console.log("Member:  michael@opsflow.local / User@123");
  console.log("Member:  olivia@opsflow.local / User@123");
  console.log("Member:  james@opsflow.local / User@123");
  console.log("Member:  sophia@opsflow.local / User@123");
  console.log("Member:  ethan@opsflow.local / User@123");
  console.log("Member:  isabella@opsflow.local / User@123");
  console.log("");
  console.log("🚀 Ready for testing!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
