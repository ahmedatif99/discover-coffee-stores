import {
  table,
  findRecordByFilter,
  getMinifiedRecords,
} from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
  try {
    if (req.method === "PUT") {
      const { id } = req.body;
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          const record = records[0];
          const calculating = parseInt(record.voting) + 1;

          //   updating the record
          const updatedRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculating,
              },
            },
          ]);
          if (updatedRecord) {
            res.json(getMinifiedRecords(updatedRecord));
          }
        } else {
          res.json({ message: "Coffee store id dose'nt exist", id });
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missing" });
      }
    }
  } catch (err) {
    res.status(500);
    res.json({ message: "Error Upvoting your coffee store ...", err });
  }
};

export default favouriteCoffeeStoreById;
