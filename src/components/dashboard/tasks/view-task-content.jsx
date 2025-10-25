const ViewTaskContent = ({ row }) => {

    return (
        <>
            <p className="text-sm"> Title : {row.getValue("title")}</p>
            <p className="text-sm"> Description : {row.getValue("description")}</p>
            <p className="text-sm"> Employee ID : {row.getValue("employeeId")}</p>
            <p className="text-sm"> Assigned By : {row.getValue("assignedBy")}</p>
            <p className="text-sm"> Priority : {row.getValue("priority")}</p>
            <p className="text-sm"> Status : {row.getValue("status")}</p>
            <p className="text-sm"> Due Date : {row.getValue("dueDate")}</p>
            <p className="text-sm"> Created At : {row.getValue("createdAt")}</p>
            <p className="text-sm"> Last Edited : {row.getValue("lastEditedAt")}</p>
        </>
    )
}

export default ViewTaskContent;
