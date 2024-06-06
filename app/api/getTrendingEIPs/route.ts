import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { subDays } from "date-fns";
import { PageVisit } from "@/models/pageVisit";

export const GET = async (req: NextRequest) => {
  await mongoose.connect(process.env.MONGODB_URL!);

  const sevenDaysAgo = subDays(new Date(), 7);

  const topPages = await PageVisit.aggregate([
    {
      $match: {
        timestamp: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: "$eipNo",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 3,
    },
  ]);

  return new Response(JSON.stringify(topPages), {
    status: 200,
  });
};
