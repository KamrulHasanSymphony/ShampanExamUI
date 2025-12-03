using System.ComponentModel.DataAnnotations;

namespace ShampanExam.Models
{
    public class UserProfileVM
    {
        public string? Id { get; set; }       

        [Required]
        [Display(Name = "User Name")]
        public string? UserName { get; set; }

        [Required]
        [Display(Name = "Full Name")]
        public string? FullName { get; set; }

        [Required]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$",
        ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; }

        [Required]
        [Display(Name = "Confirm Password")]
        public string ConfirmPassword { get; set; }

        [Display(Name = "Current Password")]
        public string? CurrentPassword { get; set; }

        [Required(ErrorMessage = "Please enter your email address.")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        public string Email { get; set; }
        [Display(Name = "Phone Number")]

        [Required(ErrorMessage = "Please enter your phone number.")]
        [RegularExpression(@"^\d{11}$", ErrorMessage = "Please enter a valid 11-digit phone number.")]
        public string PhoneNumber { get; set; }
        public string? NormalizedPassword { get; set; }
        public string? Operation { get; set; }
        public string? Mode { get; set; }
        public bool IsAdmin { get; set; }


        [Display(Name = "Is Head Office")]
        public bool IsHeadOffice { get; set; }
        [Display(Name = "Bangla Name")]
        public string? BanglaName { get; set; }
        [Required]

        [Display(Name = "NID No.")]
        public string? NIDNo { get; set; }
        public string? Type { get; set; }
        [Required]
        [Display(Name = "Type")]
        public int? TypeId { get; set; }
        [Display(Name = "Alternative Mobile No.")]
        public string? PhoneNumber2 { get; set; }
        public int? ApplicationUserId { get; set; }

 
        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }
        public string? CreatedFrom { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }
        public string? LastUpdateFrom { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

    }

}
