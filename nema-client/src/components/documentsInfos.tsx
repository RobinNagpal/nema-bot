import { useState } from 'react';
import Table from './documentsTable';
import Dropdown from './dropdown';
import CreateDocumentInfo from './createDocumentInfo';

const Docs = () => {
  const [isDropdown, setIsDropdown] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateClick = () => {
    setIsCreating(true);
  };

  const handleCreateCancel = () => {
    setIsCreating(false);
  };

  const handleClick = () => {
    setIsDropdown((prevValue) => !prevValue);
  };

  return (
    <div className="border-2 border-black m-20 rounded-xl">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl mt-5 mx-5">Documents List</h1>
        <div className="mr-5 static ml-auto transform translate-y-[-70%]">
          <Dropdown options={['Create']} handleCreateClick={handleCreateClick} />
        </div>
      </div>
      {isCreating ? <CreateDocumentInfo handleCreateCancel={handleCreateCancel} /> : <Table />}
    </div>
  );
};

export default Docs;
