package com.fitsphere.service;

import com.fitsphere.dto.UserRegistrationDto;
import com.fitsphere.model.User;
import java.util.List;

public interface UserService {
    User registerUser(UserRegistrationDto userRegistrationDto);
    List<User> getAllUsers();
    User getUserById(Long id);
    User getUserByEmail(String email);
}
