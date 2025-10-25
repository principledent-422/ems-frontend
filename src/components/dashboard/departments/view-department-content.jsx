const ViewDepartmentContent = ({ row }) => {

    return (
      <>
        <p className="text-sm"> Department Slug : {row.getValue("departmentSlug")}</p>
        <p className="text-sm"> Name : {row.getValue("name")}</p>
        <p className="text-sm"> Description : {row.getValue("description")}</p>
        <p className="text-sm"> Supervisor ID : {row.getValue("supervisorId")}</p>
        <p className="text-sm"> Created At : {row.getValue("createdAt")}</p>
        <p className="text-sm"> Last Edited : {row.getValue("lastEditedAt")}</p>
      </>
    )
  }

  export default ViewDepartmentContent;
