import React from "react";

export default function NewsletterForm() {
  return (
    <form
    // onSubmit={handleSubmit}
    >
      <div className="form-group">
        <input required type="text" placeholder="Email..." />
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}
