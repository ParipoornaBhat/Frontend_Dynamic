import React from 'react';

const CustomInput = ({ section, field, label, type = "text", BOPP, handleInputChange, required }) => {
  return (
    <div className="ItemForm-Job-input">
      <label className="ItemForm-form-label">{label} :</label>
      <input
        type={type}
        name={field}
        value={BOPP[section]?.[field] || ""}
        onChange={(e) => handleInputChange(section, field, e.target.value)}
        className="ItemForm-form-input"
        {...(required && { required: true })} // Apply `required` only if passed
      />
    </div>
  );
};

const CustomSelect = ({ section, field, label, options, BOPP, handleInputChange, required }) => {
  return (
    <div className="ItemForm-Job-select">
      <label className="ItemForm-form-label">{label} :</label>
      <select
        value={BOPP[section]?.[field] ?? ""}
        onChange={(e) =>
          handleInputChange(
            section,
            field,
            e.target.value === "true" ? true : e.target.value === "false" ? false : e.target.value
          )
        }
        className="ItemForm-form-select"
        {...(required && { required: true })}
      >
        <option value="">Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option === true ? "Yes" : option === false ? "No" : option}
          </option>
        ))}
      </select>
    </div>
  );
};


const RemarkCheck2 = ({ section, label, isItemInfo, BOPP, handleInputChange, required }) => (
  <div className="ItemForm-Job-remarkcheck">
    <div className="ItemForm-Job-remark-checkbox">
      <input
        className="ItemForm-Job-remark-inputcheck"
        type="checkbox"
        name={`${section}remarkcheck`}
        checked={isItemInfo ? BOPP.itemInfo.descriptionCheck : BOPP[section]?.jobInfo?.remarksChecked || false}
        onChange={(e) =>
          isItemInfo
            ? handleInputChange("itemInfo", "descriptionCheck", e.target.checked)
            : handleInputChange(section, "jobInfo", e.target.checked, "remarksChecked")
        }
      />
      <label className="ItemForm-Job-remark-label">{label}</label>
    </div>

    {(isItemInfo ? BOPP.itemInfo.descriptionCheck : BOPP[section]?.jobInfo?.remarksChecked) && (
      <div className="ItemForm-Job-textbox">
        <textarea
          name={isItemInfo ? "description" : `${section}Remarks`}
          value={isItemInfo ? BOPP.itemInfo.description : BOPP[section]?.jobInfo?.Remarks || ""}
          onChange={(e) =>
            isItemInfo
              ? handleInputChange("itemInfo", "description", e.target.value)
              : handleInputChange(section, "jobInfo", e.target.value, "Remarks")
          }
          className="ItemForm-Job-remark-textarea"
          {...(required && { required: true })} // Apply `required` only if passed
        />
      </div>
    )}
  </div>
);

const RemarkCheck = ({ section, label, BOPP, handleInputChange, required }) => {
  return (
    <div className="ItemForm-Job-remarkcheck">
      <div className="ItemForm-Job-remark-checkbox">
        <input
          className="ItemForm-Job-remark-inputcheck"
          type="checkbox"
          name={`${section}remarkcheck`}
          checked={BOPP[section]?.jobInfo?.remarksChecked || false}
          onChange={(e) => handleInputChange(section, "jobInfo", e.target.checked, "remarksChecked")}
        />
        <label className="ItemForm-Job-remark-label">{label}</label>
      </div>

      {BOPP[section]?.jobInfo?.remarksChecked && (
        <div className="ItemForm-Job-textbox">
          <textarea
            name={`${section}Remarks`}
            value={BOPP[section]?.jobInfo?.Remarks || ""}
            onChange={(e) => handleInputChange(section, "jobInfo", e.target.value, "Remarks")}
            className="ItemForm-Job-remark-textarea"
            {...(required && { required: true })} // Apply `required` only if passed
          />
        </div>
      )}
    </div>
  );
};

export { CustomInput, CustomSelect, RemarkCheck, RemarkCheck2 };
