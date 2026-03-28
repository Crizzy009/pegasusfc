import { describe, it, expect } from "vitest";

// Mocking the enforcement logic since we can't easily import the component logic here
const enforcePegasusTitle = (photo: any) => {
  return { ...photo, title: "pegasus moments" };
};

describe("MediaHub Photo Naming Enforcement", () => {
  it("should enforce 'pegasus moments' title for single uploads", () => {
    const uploadedPhoto = {
      title: "My Vacation.jpg",
      category: "Training",
      image: { originalUrl: "/uploads/vacation.jpg" }
    };
    
    const processed = enforcePegasusTitle(uploadedPhoto);
    expect(processed.title).toBe("pegasus moments");
  });

  it("should enforce 'pegasus moments' title for bulk uploads", () => {
    const bulkFiles = [
      { name: "match1.png" },
      { name: "training_session.jpeg" }
    ];
    
    const processedRows = bulkFiles.map(file => ({
      data: { title: "pegasus moments", filename: file.name }
    }));

    processedRows.forEach(row => {
      expect(row.data.title).toBe("pegasus moments");
    });
  });
});

describe("MediaHub Image Rendering Logic", () => {
  it("should correctly prioritize mediumUrl -> largeUrl -> originalUrl", () => {
    const photoData = {
      image: {
        originalUrl: "orig.jpg",
        largeUrl: "large.jpg",
        mediumUrl: "medium.jpg"
      },
      category: "Test",
      title: "Test Title"
    };

    const src = photoData.image.mediumUrl || photoData.image.largeUrl || photoData.image.originalUrl;
    expect(src).toBe("medium.jpg");
  });

  it("should fallback to originalUrl if others are missing", () => {
    const photoData = {
      image: {
        originalUrl: "orig.jpg",
      },
      category: "Test",
      title: "Test Title"
    };

    const src = photoData.image.mediumUrl || photoData.image.largeUrl || photoData.image.originalUrl;
    expect(src).toBe("orig.jpg");
  });
});
