const ViewUserContent = ({ row }) => {

    return (
      <>
        <p className="text-sm"> Username : {row.getValue("username")}</p>
        <p className="text-sm"> Name : {row.getValue("name")}</p>
        <p className="text-sm"> Email : {row.getValue("email")}</p>
        <p className="text-sm"> Role : {row.getValue("role")}</p>
        <p className="text-sm"> Phone Number : {row.getValue("phoneNumber")}</p>
        <p className="text-sm"> Address : {row.getValue("address")}</p>
        <p className="text-sm"> Created At : {row.getValue("createdAt")}</p>
        <p className="text-sm"> Last Edited : {row.getValue("lastEditedAt")}</p>
      </>
    )
  }

  export default ViewUserContent;
